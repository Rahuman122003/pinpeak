import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQ } from "@/components/FAQ";
import { Trending } from "@/components/Trending";

export default function Page() {
  return (
    <>
      <Hero />
      <Trending />
      <Features />
      <HowItWorks />
      <FAQ />
      <SeoBlock />
      <JsonLd />
    </>
  );
}

function SeoBlock() {
  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 prose prose-neutral dark:prose-invert">
        <h2 className="text-2xl font-semibold">
          The premium Pinterest video &amp; image downloader
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          PinPeak is the fastest way to download Pinterest videos and images in
          original quality. Whether you need a 4K Pinterest video for your
          mood board, a high-resolution Pinterest image for a presentation, or
          a clean GIF without watermark for a social post, PinPeak fetches the
          exact source file Pinterest hosts on its CDN — no recompression, no
          quality loss, no logo stamped on top.
        </p>
        <h3 className="text-xl font-semibold">Supported pin types</h3>
        <ul className="text-neutral-600 dark:text-neutral-400">
          <li>Pinterest videos (MP4 + HLS, up to 1080p and beyond)</li>
          <li>Pinterest images (HD, Full HD, 2K, 4K, Original)</li>
          <li>Animated GIF pins</li>
          <li>Carousel pins (multi-slot)</li>
          <li>Story pins (multi-page)</li>
        </ul>
        <h3 className="text-xl font-semibold">Why creators choose PinPeak</h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Other downloaders proxy thumbnails or downscale media before serving
          it. PinPeak rewrites the CDN path back to Pinterest's
          <code> /originals/ </code> endpoint and exposes every video bitrate
          Pinterest publishes — so you always walk away with the highest
          quality file available.
        </p>
      </div>
    </section>
  );
}

function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PinPeak",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    description:
      "Download Pinterest videos and images in HD, 2K, 4K and Original Resolution without watermark.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "12480",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
