"use client";
import { motion } from "framer-motion";
import { Download, ImageIcon, Video, Layers, BookOpen, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { MediaVariant, PinMedia } from "@/lib/pinterest";

function KindIcon({ kind }: { kind: PinMedia["kind"] }) {
  const cls = "text-brand-500";
  if (kind === "video") return <Video size={14} className={cls} />;
  if (kind === "carousel") return <Layers size={14} className={cls} />;
  if (kind === "story") return <BookOpen size={14} className={cls} />;
  return <ImageIcon size={14} className={cls} />;
}

function formatSize(b?: number) {
  if (!b) return "";
  const mb = b / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;
}

function VariantRow({
  v,
  pinId,
  index,
}: {
  v: MediaVariant;
  pinId: string;
  index: number;
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  async function download() {
    const filename = `pinpeak-${pinId}-${v.label.replace(/\s+/g, "")}-${index}.${v.ext}`;
    const proxy = `/api/download?url=${encodeURIComponent(v.url)}&filename=${encodeURIComponent(
      filename
    )}`;
    try {
      setProgress(0);
      const res = await fetch(proxy);
      if (!res.ok || !res.body) throw new Error("Download failed");
      const total = Number(res.headers.get("content-length") || 0);
      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          if (total) setProgress(Math.round((received / total) * 100));
        }
      }
      // @ts-ignore
      const blob = new Blob(chunks, {
        type: res.headers.get("content-type") || "application/octet-stream",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setDone(true);
      setTimeout(() => {
        setDone(false);
        setProgress(null);
      }, 1800);
    } catch {
      setProgress(null);
      // Fallback: just open the proxy
      window.open(proxy, "_blank");
    }
  }

  const isHls = v.ext === "m3u8";

  return (
    <button
      onClick={download}
      disabled={progress !== null && !done}
      className="group relative flex w-full items-center justify-between gap-3 rounded-xl border border-black/5 dark:border-white/10 bg-white/60 dark:bg-white/[0.03] px-4 py-3 hover:border-brand-500/40 hover:shadow-soft transition disabled:opacity-80"
    >
      <span
        aria-hidden
        style={{ width: `${progress ?? 0}%` }}
        className="absolute inset-y-0 left-0 rounded-xl bg-gradient-to-r from-brand-500/15 to-purple-500/15 transition-[width] duration-200"
      />
      <span className="relative flex items-center gap-3">
        <span className="rounded-md bg-gradient-to-br from-brand-500 to-purple-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
          {v.label}
        </span>
        <span className="text-sm text-neutral-700 dark:text-neutral-300">
          {v.width && v.height ? `${v.width}×${v.height}` : v.type.toUpperCase()}{" "}
          · .{v.ext}
          {v.size ? ` · ${formatSize(v.size)}` : ""}
        </span>
      </span>
      <span className="relative inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400">
        {done ? (
          <>
            <Check size={14} /> Saved
          </>
        ) : progress !== null ? (
          <>{progress}%</>
        ) : (
          <>
            <Download size={14} /> {isHls ? "Stream" : "Download"}
          </>
        )}
      </span>
    </button>
  );
}

export function Preview({ data }: { data: PinMedia }) {
  const [copied, setCopied] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const items = data.items?.length ? data.items : null;
  const active = items ? items[activeIdx] : null;
  const variants = active ? active.variants : data.variants;
  const thumb = active ? active.thumbnail : data.thumbnail;
  const kind = active ? active.kind : data.kind;

  async function copyUrl() {
    await navigator.clipboard.writeText(data.source);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass rounded-2xl p-4 sm:p-5 shadow-soft"
    >
      <div className="grid gap-5 sm:grid-cols-[280px_1fr]">
        <div className="relative">
          <div className="relative overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
            {kind === "video" ? (
              <video
                key={thumb}
                src={variants.find((v) => v.ext !== "m3u8")?.url}
                poster={thumb}
                controls
                playsInline
                className="aspect-[3/4] w-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumb}
                alt={data.title || "Pinterest pin"}
                className="aspect-[3/4] w-full object-cover"
                loading="lazy"
              />
            )}
            <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur">
              <KindIcon kind={kind} />
              {kind.toUpperCase()}
            </span>
          </div>
          {items && (
            <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
              {items.map((it, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`relative h-14 w-14 flex-none overflow-hidden rounded-lg ring-2 transition ${
                    i === activeIdx
                      ? "ring-brand-500"
                      : "ring-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-semibold">
                {data.title || "Pinterest Pin"}
              </h3>
              {data.author?.name && (
                <p className="mt-0.5 text-sm text-neutral-500">
                  by {data.author.name}
                </p>
              )}
            </div>
            <button
              onClick={copyUrl}
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 dark:border-white/10 px-2.5 py-1.5 text-xs hover:bg-black/5 dark:hover:bg-white/5"
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied" : "Copy URL"}
            </button>
          </div>

          {data.description && (
            <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
              {data.description}
            </p>
          )}

          <div className="mt-4 space-y-2">
            <p className="text-xs uppercase tracking-widest text-neutral-500">
              Available qualities
            </p>
            <div className="space-y-2">
              {variants.length === 0 && (
                <p className="text-sm text-neutral-500">
                  No downloadable media found.
                </p>
              )}
              {variants.map((v, i) => (
                <VariantRow key={v.url} v={v} pinId={data.id} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
