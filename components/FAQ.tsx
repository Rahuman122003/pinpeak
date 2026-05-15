"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    q: "Is PinPeak really free?",
    a: "Yes. PinPeak is free for personal use. You can download as many Pinterest videos and images as you like, in original 4K quality, without an account.",
  },
  {
    q: "Will downloads have a watermark?",
    a: "No. Pinterest doesn't watermark source media. PinPeak fetches that exact source file, so what you download is byte-identical to what the creator uploaded.",
  },
  {
    q: "How do you achieve 4K quality?",
    a: "We rewrite the Pinterest CDN path to the `originals` endpoint and surface every video bitrate Pinterest hosts. If a creator uploaded in 4K, you'll get 4K.",
  },
  {
    q: "Does it support carousel and story pins?",
    a: "Yes. Multi-slot carousels and story pin pages are detected automatically. You can preview and download each slot individually.",
  },
  {
    q: "Do you store my URLs or files?",
    a: "No. Requests are cached for a few minutes purely for speed. Files stream directly from Pinterest's CDN through a thin proxy and are never persisted.",
  },
  {
    q: "Can I use the downloaded files commercially?",
    a: "Copyright stays with the original creator. PinPeak only helps you save publicly available media — please respect the creator's rights and Pinterest's terms.",
  },
];

function Item({ q, a, open, onClick }: { q: string; a: string; open: boolean; onClick: () => void }) {
  return (
    <div className="glass rounded-2xl">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-medium">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform ${open ? "rotate-180 text-brand-500" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-500">FAQ</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            Questions, <span className="gradient-text">answered</span>.
          </h2>
        </div>
        <div className="mt-10 space-y-3">
          {FAQS.map((f, i) => (
            <Item
              key={f.q}
              q={f.q}
              a={f.a}
              open={open === i}
              onClick={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
