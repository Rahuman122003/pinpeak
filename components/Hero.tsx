"use client";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Zap, Crown } from "lucide-react";
import { Downloader } from "./Downloader";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-10 pb-24 sm:pt-16">
      <div className="aurora" />
      <div className="absolute inset-0 -z-10 bg-grid-light dark:bg-grid-dark [mask-image:radial-gradient(ellipse_at_top,white,transparent_70%)] [background-size:40px_40px] opacity-50" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300"
        >
          <Sparkles size={12} className="text-brand-500" />
          The premium Pinterest downloader · 4K · No watermark
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mx-auto mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          Download Pinterest Videos &amp; Images in{" "}
          <span className="gradient-text">4K Quality</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mx-auto mt-5 max-w-2xl text-balance text-base text-neutral-600 dark:text-neutral-300 sm:text-lg"
        >
          Instantly save Pinterest content in HD, 2K, 4K and Original Resolution
          with zero quality loss. Pin URLs in — pristine files out.
        </motion.p>

        <div className="mt-10">
          <Downloader />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {[
            { icon: Crown, label: "Original 4K" },
            { icon: ShieldCheck, label: "No watermark" },
            { icon: Zap, label: "Instant fetch" },
            { icon: Sparkles, label: "Carousel & Story" },
          ].map((b) => (
            <div
              key={b.label}
              className="glass flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-medium"
            >
              <b.icon size={14} className="text-brand-500" />
              {b.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
