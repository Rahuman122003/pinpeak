import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";

/**
 * Streaming proxy that forces a download with the chosen filename
 * and bypasses CORS limitations of pinimg/v.pinimg CDNs.
 *
 * Pinterest's CDN occasionally 403s based on Referer/Origin combinations,
 * so we try several header strategies until one succeeds.
 */
async function tryFetch(target: string, range: string | null) {
  const strategies: Record<string, string>[] = [
    {
      "User-Agent": UA,
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://www.pinterest.com/",
      Origin: "https://www.pinterest.com",
    },
    {
      "User-Agent": UA,
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
    },
    {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      Accept: "*/*",
      Referer: "https://www.pinterest.com/",
    },
    {
      "User-Agent": UA,
      Accept: "*/*",
      Referer: "https://i.pinimg.com/",
    },
  ];

  for (const headers of strategies) {
    if (range) headers["Range"] = range;
    const res = await fetch(target, { headers, redirect: "follow" });
    if (res.ok || res.status === 206) return res;
    // 403/451/etc — try next strategy
    if (res.status !== 403 && res.status !== 451 && res.status !== 401) {
      return res;
    }
  }
  return null;
}

export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get("url");
  const filename =
    req.nextUrl.searchParams.get("filename") || "pinpeak-download";
  if (!u) return new NextResponse("Missing url", { status: 400 });

  let target: URL;
  try {
    target = new URL(u);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }
  if (!/(pinimg\.com|pinterest\.com)$/i.test(target.hostname)) {
    return new NextResponse("Host not allowed", { status: 403 });
  }

  const range = req.headers.get("range");
  const upstream = await tryFetch(target.toString(), range);

  if (!upstream || !upstream.body || (!upstream.ok && upstream.status !== 206)) {
    const status = upstream?.status ?? 502;
    return new NextResponse(`Upstream error: ${status}`, { status: 502 });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    upstream.headers.get("content-type") || "application/octet-stream"
  );
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);
  const cr = upstream.headers.get("content-range");
  if (cr) headers.set("Content-Range", cr);
  headers.set(
    "Content-Disposition",
    `attachment; filename="${filename.replace(/[^\w.\- ]+/g, "_")}"`
  );
  headers.set("Cache-Control", "public, max-age=86400");
  headers.set("Accept-Ranges", "bytes");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}
