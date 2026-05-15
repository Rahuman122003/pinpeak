"use client";
import { motion } from "framer-motion";
import { Link2, Wand2, Download } from "lucide-react";

const STEPS = [
  {
    icon: Link2,
    title: "Paste the URL",
    desc: "Copy any Pinterest pin link from the app or browser — pin.it shortlinks work too.",
  },
  {
    icon: Wand2,
    title: "We fetch the source",
    desc: "Our engine extracts the original CDN file in every available resolution — no compression.",
  },
  {
    icon: Download,
    title: "Download in 4K",
    desc: "Pick HD, 2K, 4K or Original. The file streams to your device, watermark-free.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-500">
            How it works
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            Three steps to a <span className="gradient-text">perfect file</span>.
          </h2>
        </div>
        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent md:block" />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass relative rounded-2xl p-6 text-center"
            >
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 text-white shadow-glow">
                <s.icon size={22} />
              </div>
              <div className="mt-3 text-xs uppercase tracking-widest text-neutral-500">
                Step {i + 1}
              </div>
              <h3 className="mt-1 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
