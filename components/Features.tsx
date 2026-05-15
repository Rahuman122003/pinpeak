"use client";
import { motion } from "framer-motion";
import {
  Crown,
  ShieldCheck,
  Zap,
  Layers,
  Image as ImageIcon,
  Video,
  Cpu,
  Smartphone,
  Lock,
} from "lucide-react";

const FEATURES = [
  {
    icon: Crown,
    title: "True 4K & Original",
    desc: "We rebuild the original-resolution CDN URL so you always get the source file — never compressed thumbnails.",
  },
  {
    icon: ShieldCheck,
    title: "No watermark, ever",
    desc: "Pinterest doesn't watermark its source media — we deliver it untouched, exactly as the creator uploaded it.",
  },
  {
    icon: Zap,
    title: "Instant fetch engine",
    desc: "Edge-cached extraction with anti rate-limit retries. Most pins resolve in under 800ms.",
  },
  {
    icon: Video,
    title: "Every video bitrate",
    desc: "MP4 and HLS variants up to 1080p+ are surfaced — pick the highest, or grab them all.",
  },
  {
    icon: ImageIcon,
    title: "GIF & still images",
    desc: "Animated GIFs and high-DPI stills download with their full frame data and aspect ratio.",
  },
  {
    icon: Layers,
    title: "Carousel & Story pins",
    desc: "Multi-slot carousels and story pages are auto-detected and downloadable individually.",
  },
  {
    icon: Cpu,
    title: "AI URL detection",
    desc: "Paste anything containing a Pinterest link — we'll find the pin, even from messy clipboard text.",
  },
  {
    icon: Smartphone,
    title: "Mobile-first design",
    desc: "Built to feel native on iOS and Android with one-tap paste and clipboard auto-detect.",
  },
  {
    icon: Lock,
    title: "Privacy by default",
    desc: "No login, no tracking, no stored URLs. Files stream straight from Pinterest's CDN to your device.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-500">
            Why PinPeak
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            Built for people who care about <span className="gradient-text">quality</span>.
          </h2>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">
            Every detail — from the extractor to the UI — is engineered so your
            saved pins look as crisp as the originals.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.04 }}
              className="glass group relative overflow-hidden rounded-2xl p-6 hover:shadow-soft transition"
            >
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-brand-500/30 to-purple-500/30 blur-3xl opacity-0 group-hover:opacity-100 transition" />
              <div className="relative">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 text-white shadow-glow">
                  <f.icon size={18} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
