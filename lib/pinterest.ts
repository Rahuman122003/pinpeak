import axios from "axios";

/**
 * PinPeak Pinterest extractor.
 *
 * Strategy (in order):
 *  1. Resolve `pin.it` shortlinks via redirect chain.
 *  2. Pull the numeric pin id out of the URL.
 *  3. PRIMARY: hit Pinterest's public widget API
 *     https://widgets.pinterest.com/v3/pidgets/pins/info/?pin_ids=<id>
 *     — this returns the full pin JSON (images, videos, carousel, story)
 *     without auth. Used by Pinterest's own embed widget, very stable.
 *  4. FALLBACK: scrape the pin HTML for `__PWS_DATA__` and parse.
 *  5. Rebuild the highest-resolution `originals` image URL by rewriting
 *     the size token in the CDN path (`/236x/`, `/736x/` -> `/originals/`).
 */

export type MediaKind = "image" | "video" | "gif" | "carousel" | "story";

export interface MediaVariant {
  label: string;
  url: string;
  width?: number;
  height?: number;
  type: "image" | "video";
  ext: string;
  size?: number;
}

export interface PinMedia {
  id: string;
  kind: MediaKind;
  title?: string;
  description?: string;
  author?: { name?: string; avatar?: string; url?: string };
  thumbnail: string;
  width?: number;
  height?: number;
  duration?: number;
  variants: MediaVariant[];
  items?: Array<{
    thumbnail: string;
    variants: MediaVariant[];
    kind: MediaKind;
  }>;
  source: string;
}

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";

function isPinterestUrl(u: string): boolean {
  try {
    const url = new URL(u);
    return (
      /(^|\.)pinterest\.[a-z.]+$/i.test(url.hostname) ||
      url.hostname === "pin.it"
    );
  } catch {
    return false;
  }
}

async function resolveShortUrl(u: string): Promise<string> {
  const url = new URL(u);
  if (url.hostname !== "pin.it") return u;
  const res = await axios.get(u, {
    maxRedirects: 5,
    headers: { "User-Agent": UA },
    validateStatus: () => true,
  });
  return (
    res.request?.res?.responseUrl ||
    res.headers?.["location"] ||
    res.config.url ||
    u
  );
}

function extractPinId(u: string): string | null {
  // /pin/<id>/  or  /pin/<slug>--<id>/  or  ?pin_id=<id>
  const m1 = u.match(/\/pin\/(?:[^\/]*?-)?(\d{5,})/);
  if (m1) return m1[1];
  const m2 = u.match(/[?&]pin_id=(\d+)/);
  if (m2) return m2[1];
  return null;
}

function tierForHeight(h?: number): string {
  if (!h) return "Original";
  if (h >= 2160) return "4K";
  if (h >= 1440) return "2K";
  if (h >= 1080) return "Full HD";
  if (h >= 720) return "HD";
  return "SD";
}

function rewriteToOriginal(imgUrl: string): string {
  return imgUrl.replace(/\/(\d+x\d*|originals)\//i, "/originals/");
}

function extractEmbeddedJson(html: string): any | null {
  const ids = ["__PWS_DATA__", "__PWS_INITIAL_PROPS__", "initial-state"];
  for (const id of ids) {
    const re = new RegExp(
      `<script[^>]*id=["']${id}["'][^>]*>([\\s\\S]*?)<\\/script>`,
      "i"
    );
    const m = html.match(re);
    if (m && m[1]) {
      try {
        return JSON.parse(m[1].trim());
      } catch {
        /* try next */
      }
    }
  }
  return null;
}

function findPinNode(json: any): any | null {
  const seen = new Set<any>();
  const stack: any[] = [json];
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== "object" || seen.has(node)) continue;
    seen.add(node);
    if (
      node.id &&
      (node.images || node.videos || node.story_pin_data || node.carousel_data)
    ) {
      return node;
    }
    for (const k of Object.keys(node)) {
      const v = (node as any)[k];
      if (v && typeof v === "object") stack.push(v);
    }
  }
  return null;
}

function buildImageVariants(images: any): MediaVariant[] {
  if (!images || typeof images !== "object") return [];
  const variants: MediaVariant[] = [];
  const seen = new Set<string>();
  const push = (label: string, v: any) => {
    if (!v?.url || seen.has(v.url)) return;
    seen.add(v.url);
    variants.push({
      label,
      url: v.url,
      width: v.width,
      height: v.height,
      type: "image",
      ext: (v.url.split(".").pop() || "jpg").split("?")[0].toLowerCase(),
    });
  };

  // Map known size keys -> a candidate quality label (only used if larger
  // tiers are absent). Preserve real URLs only — never synthesize.
  const orig = images.orig || images.originals;
  if (orig?.url) push("Original", orig);

  // Collect every sized variant the API actually returned, sorted by width desc.
  const sized: Array<{ key: string; v: any; w: number }> = [];
  for (const k of Object.keys(images)) {
    if (k === "orig" || k === "originals") continue;
    const v = images[k];
    const m = k.match(/^(\d+)x/);
    if (v?.url && m) sized.push({ key: k, v, w: parseInt(m[1], 10) });
  }
  sized.sort((a, b) => b.w - a.w);

  // If we have no /originals/ from the API, promote the largest real size to "Original".
  if (!orig?.url && sized.length) {
    push("Original", sized[0].v);
  }

  const labelFor = (w: number, h?: number): string => {
    const dim = h && h > w ? h : w;
    if (dim >= 2160) return "4K";
    if (dim >= 1440) return "2K";
    if (dim >= 1080) return "Full HD";
    if (dim >= 720) return "HD";
    return `${dim}px`;
  };
  for (const s of sized) {
    push(labelFor(s.w, s.v.height), s.v);
  }
  return variants;
}

function buildVideoVariants(videos: any): MediaVariant[] {
  const list = videos?.video_list || videos;
  const variants: MediaVariant[] = [];
  const seen = new Set<string>();
  for (const key of Object.keys(list || {})) {
    const v = list[key];
    if (!v?.url || seen.has(v.url)) continue;
    seen.add(v.url);
    const isHls = /\.m3u8(\?|$)/i.test(v.url);
    const ext = isHls
      ? "m3u8"
      : (v.url.split(".").pop() || "mp4").split("?")[0].toLowerCase();
    variants.push({
      label: tierForHeight(v.height) + (isHls ? " (HLS)" : ""),
      url: v.url,
      width: v.width,
      height: v.height,
      type: "video",
      ext,
    });
  }
  variants.sort((a, b) => {
    if (a.ext === "m3u8" && b.ext !== "m3u8") return 1;
    if (b.ext === "m3u8" && a.ext !== "m3u8") return -1;
    return (b.height || 0) - (a.height || 0);
  });
  const topMp4 = variants.find((v) => v.ext !== "m3u8");
  if (topMp4) topMp4.label = `Original • ${topMp4.height || ""}p`.trim();
  return variants;
}

function normalizePin(pin: any, sourceUrl: string): PinMedia {
  const id = String(pin.id || pin.entityId || "unknown");
  const title =
    pin.title ||
    pin.grid_title ||
    pin.rich_summary?.display_name ||
    pin.seo_title;
  const description = pin.description || pin.seo_description;
  const author = pin.pinner
    ? {
        name: pin.pinner.full_name || pin.pinner.username,
        avatar: pin.pinner.image_medium_url || pin.pinner.image_small_url,
        url: pin.pinner.username
          ? `https://www.pinterest.com/${pin.pinner.username}/`
          : undefined,
      }
    : undefined;

  // VIDEO
  if (pin.videos && (pin.videos.video_list || Object.keys(pin.videos).length)) {
    const variants = buildVideoVariants(pin.videos);
    const poster =
      pin.images?.orig?.url ||
      pin.images?.["736x"]?.url ||
      pin.images?.["564x"]?.url ||
      "";
    if (variants.length) {
      return {
        id,
        kind: "video",
        title,
        description,
        author,
        thumbnail: poster,
        duration: pin.videos?.duration,
        variants,
        source: sourceUrl,
      };
    }
  }

  // STORY PIN
  if (pin.story_pin_data?.pages?.length) {
    const items = pin.story_pin_data.pages.map((p: any) => {
      const block = p.blocks?.[0] || {};
      if (block.video) {
        return {
          kind: "video" as MediaKind,
          thumbnail: block.video.poster_image?.url || "",
          variants: buildVideoVariants(block.video.video_list || block.video),
        };
      }
      const imgs = block.image?.images || block.image || {};
      return {
        kind: "image" as MediaKind,
        thumbnail: imgs?.["736x"]?.url || imgs?.orig?.url || "",
        variants: buildImageVariants(imgs),
      };
    });
    return {
      id,
      kind: "story",
      title,
      description,
      author,
      thumbnail: items[0]?.thumbnail || "",
      variants: items[0]?.variants || [],
      items,
      source: sourceUrl,
    };
  }

  // CAROUSEL
  if (pin.carousel_data?.carousel_slots?.length) {
    const items = pin.carousel_data.carousel_slots.map((s: any) => ({
      kind: "image" as MediaKind,
      thumbnail: s.images?.["736x"]?.url || s.images?.orig?.url || "",
      variants: buildImageVariants(s.images),
    }));
    return {
      id,
      kind: "carousel",
      title,
      description,
      author,
      thumbnail: items[0]?.thumbnail || "",
      variants: items[0]?.variants || [],
      items,
      source: sourceUrl,
    };
  }

  // IMAGE / GIF
  const variants = buildImageVariants(pin.images);
  const isGif =
    variants.some((v) => v.ext === "gif") ||
    /\.gif(\?|$)/i.test(variants[0]?.url || "");
  return {
    id,
    kind: isGif ? "gif" : "image",
    title,
    description,
    author,
    thumbnail:
      pin.images?.["736x"]?.url ||
      pin.images?.["564x"]?.url ||
      variants[0]?.url ||
      "",
    width: pin.images?.orig?.width,
    height: pin.images?.orig?.height,
    variants,
    source: sourceUrl,
  };
}

async function fetchViaWidgetApi(pinId: string): Promise<any | null> {
  // Pinterest's official embed widget endpoint — public, no auth.
  const endpoint = `https://widgets.pinterest.com/v3/pidgets/pins/info/?pin_ids=${pinId}`;
  const res = await axios.get(endpoint, {
    headers: {
      "User-Agent": UA,
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://www.pinterest.com/",
    },
    timeout: 12000,
    validateStatus: () => true,
  });
  if (res.status >= 400) return null;
  const arr = res.data?.data;
  if (Array.isArray(arr) && arr.length > 0 && !arr[0]?.error) return arr[0];
  return null;
}

async function fetchViaHtml(url: string): Promise<any | null> {
  const res = await axios.get(url, {
    headers: {
      "User-Agent": UA,
      "Accept-Language": "en-US,en;q=0.9",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    },
    timeout: 15000,
    maxRedirects: 5,
    validateStatus: () => true,
  });
  if (res.status >= 400) return null;
  const html: string = res.data;
  const json = extractEmbeddedJson(html);
  if (!json) return null;
  return findPinNode(json);
}

export async function extractPin(rawUrl: string): Promise<PinMedia> {
  if (!isPinterestUrl(rawUrl)) {
    throw new Error("Please paste a valid Pinterest URL.");
  }
  const url = await resolveShortUrl(rawUrl);
  const pinId = extractPinId(url);

  let pin: any | null = null;

  // 1) Widget API (most reliable)
  if (pinId) {
    try {
      pin = await fetchViaWidgetApi(pinId);
    } catch {
      /* fall through */
    }
  }

  // 2) HTML fallback
  if (!pin) {
    try {
      pin = await fetchViaHtml(url);
    } catch {
      /* fall through */
    }
  }

  if (!pin) {
    throw new Error(
      "Couldn't read this pin. It may be private, region-locked, or removed. Try another URL."
    );
  }

  return normalizePin(pin, url);
}
