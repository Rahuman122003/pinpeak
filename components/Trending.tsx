"use client";
import { motion } from "framer-motion";

const SAMPLES = [
  { tag: "Architecture", color: "from-amber-400 to-rose-500" },
  { tag: "Fashion", color: "from-fuchsia-500 to-purple-600" },
  { tag: "Travel", color: "from-sky-400 to-indigo-600" },
  { tag: "Food", color: "from-orange-400 to-red-600" },
  { tag: "Wallpapers", color: "from-emerald-400 to-cyan-600" },
  { tag: "Fitness", color: "from-rose-500 to-brand-600" },
  { tag: "Interior", color: "from-stone-400 to-amber-700" },
  { tag: "Anime", color: "from-pink-500 to-violet-700" },
];

export function Trending() {
  return (
    <section id="trending" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-500">
              Trending categories
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
              Saved by <span className="gradient-text">creators worldwide</span>
            </h2>
          </div>
          <p className="hidden max-w-sm text-sm text-neutral-500 sm:block">
            Millions of pins have been pulled in 4K through PinPeak — across
            every aesthetic on Pinterest.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SAMPLES.map((s, i) => (
            <motion.div
              key={s.tag}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className={`group relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br ${s.color} shadow-soft`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,white/30,transparent_60%)] mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-xs uppercase tracking-widest text-white/80">
                  Pinterest
                </p>
                <p className="text-xl font-semibold text-white">{s.tag}</p>
              </div>
              <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
                4K
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
