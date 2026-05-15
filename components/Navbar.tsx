"use client";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Mountain } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-3 flex items-center justify-between rounded-2xl glass px-4 py-2.5 shadow-soft">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 text-white shadow-glow">
              <Mountain size={16} />
            </span>
            <span className="text-lg tracking-tight">PinPeak</span>
            <span className="ml-1 text-[10px] uppercase tracking-widest text-brand-500">
              4K
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-sm text-neutral-600 dark:text-neutral-300">
            <a href="#features" className="hover:text-black dark:hover:text-white">Features</a>
            <a href="#how" className="hover:text-black dark:hover:text-white">How it works</a>
            <a href="#trending" className="hover:text-black dark:hover:text-white">Trending</a>
            <a href="#faq" className="hover:text-black dark:hover:text-white">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href="#downloader"
              className="hidden sm:inline-flex items-center rounded-full btn-gradient px-4 py-2 text-sm font-medium text-white"
            >
              Download Now
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
