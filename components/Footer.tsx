import Link from "next/link";
import { Mountain } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 text-white">
              <Mountain size={16} />
            </span>
            <span className="text-lg">PinPeak</span>
          </Link>
          <p className="mt-4 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
            The fastest way to download Pinterest videos, images, GIFs, carousel
            and story pins in HD, 2K, 4K and Original Resolution — without
            watermark and with zero quality loss.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Tools</h4>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>Pinterest Video Downloader</li>
            <li>Pinterest Image Downloader</li>
            <li>Pinterest GIF Downloader</li>
            <li>Pinterest 4K Downloader</li>
            <li>Pinterest Story Pin Saver</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>About</li>
            <li>Privacy</li>
            <li>Terms</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/5 dark:border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {year} PinPeak. Not affiliated with Pinterest, Inc.</p>
          <p>Crafted for creators who care about quality.</p>
        </div>
      </div>
    </footer>
  );
}
