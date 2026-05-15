"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardPaste, Link2, Loader2, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { Preview } from "./Preview";
import type { PinMedia } from "@/lib/pinterest";

const URL_REGEX =
  /(https?:\/\/(?:[a-z]{2,3}\.)?pinterest\.[a-z.]+\/[^\s]+|https?:\/\/pin\.it\/[^\s]+)/i;

export function Downloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PinMedia | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setError(null);
    setData(null);
    const match = url.match(URL_REGEX);
    if (!match) {
      setError("That doesn't look like a Pinterest URL.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: match[0] }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setData(json);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      // Auto-detect & submit if it looks like Pinterest
      if (URL_REGEX.test(text)) {
        setTimeout(() => handleSubmitWith(text), 50);
      }
    } catch {
      /* ignored */
    }
  }

  async function handleSubmitWith(u: string) {
    setUrl(u);
    setError(null);
    setData(null);
    setLoading(true);
    try {
      const res = await fetch("/api/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: u }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setData(json);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div id="downloader" className="relative z-10 mx-auto w-full max-w-3xl">
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="glass rounded-2xl p-2 shadow-soft"
      >
        <div className="flex items-center gap-2">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-black/5 dark:bg-white/5">
            <Link2 size={18} className="text-brand-500" />
          </div>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a Pinterest pin URL (pinterest.com/pin/... or pin.it/...)"
            className="flex-1 bg-transparent px-2 py-3 text-[15px] outline-none placeholder:text-neutral-400"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
          />
          {url && (
            <button
              type="button"
              onClick={() => setUrl("")}
              className="grid h-9 w-9 place-items-center rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Clear"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="button"
            onClick={pasteFromClipboard}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-black/5 dark:bg-white/5 px-3 py-2 text-sm hover:bg-black/10 dark:hover:bg-white/10"
          >
            <ClipboardPaste size={14} /> Paste
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl btn-gradient px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Sparkles size={16} />
            )}
            {loading ? "Fetching" : "Download"}
          </button>
        </div>
      </motion.form>

      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-neutral-500">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
        AI-powered URL detection · No login · No watermark · 4K & Original
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-300"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {loading && !data && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 grid gap-4 sm:grid-cols-[260px_1fr] glass rounded-2xl p-4"
          >
            <div className="aspect-[3/4] w-full rounded-xl skeleton" />
            <div className="space-y-3">
              <div className="h-5 w-2/3 rounded skeleton" />
              <div className="h-4 w-1/2 rounded skeleton" />
              <div className="h-10 w-full rounded skeleton" />
              <div className="h-10 w-full rounded skeleton" />
              <div className="h-10 w-2/3 rounded skeleton" />
            </div>
          </motion.div>
        )}
        {data && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            <Preview data={data} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
