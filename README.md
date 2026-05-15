# PinPeak — Premium Pinterest Video & Image Downloader (4K)

A production-ready, ultra-modern Pinterest downloader built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** and **Framer Motion**. Fetches the **original-resolution** source media from Pinterest's CDN — HD, Full HD, 2K, **4K**, Original — with **no watermark** and **zero compression**.

## ✨ Features

- Paste any Pinterest URL (`pinterest.com/pin/...` or `pin.it/...`) → instant fetch
- Download videos (MP4 + HLS), images, **GIFs**, **carousel pins**, **story pins**
- Quality tiers: **HD · Full HD · 2K · 4K · Original**
- Streaming proxy with progress bar (no CORS issues, forced filename)
- Live preview, skeleton loaders, copy-URL, dark/light mode
- Glassmorphism UI, cinematic aurora hero, Framer Motion animations
- SEO: OpenGraph, Twitter, JSON-LD, sitemap, robots
- Edge caching + in-memory LRU; pluggable Redis cache

## 🧱 Tech stack

`Next.js 14` · `TypeScript` · `Tailwind CSS` · `Framer Motion` · `lucide-react` · `axios` · `next-themes`

## 📁 Structure

```
app/
  api/
    fetch/route.ts      # POST { url } -> normalized PinMedia
    download/route.ts   # GET ?url=&filename=  (streaming proxy)
  layout.tsx            # SEO metadata, theme, nav, footer
  page.tsx              # Hero + Trending + Features + How + FAQ + SEO + JSON-LD
  robots.ts / sitemap.ts
components/
  Hero.tsx · Downloader.tsx · Preview.tsx
  Features.tsx · HowItWorks.tsx · FAQ.tsx · Trending.tsx
  Navbar.tsx · Footer.tsx · ThemeProvider.tsx · ThemeToggle.tsx
lib/
  pinterest.ts          # Extractor: parses __PWS_DATA__, rebuilds /originals/
  cache.ts              # LRU cache (Redis-ready)
```

## 🚀 Local dev

```bash
npm install
npm run dev
# http://localhost:3000
```

## ☁️ Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Framework preset: **Next.js** (auto-detected). No build overrides needed.
4. (Optional) Set environment variables:
   - `NEXT_PUBLIC_SITE_URL` = your production URL
   - `REDIS_URL` = Upstash Redis URL (for shared cache across regions)
5. Deploy. Your downloader is live.

> Tip: enable Vercel's **Edge Network** + **Image Optimization** and put Cloudflare in front for an extra CDN layer.

## 🔌 API

### `POST /api/fetch`

```json
{ "url": "https://www.pinterest.com/pin/1234567890/" }
```

Returns:

```ts
{
  id: string;
  kind: "image" | "video" | "gif" | "carousel" | "story";
  title?: string; description?: string;
  author?: { name; avatar; url };
  thumbnail: string;
  variants: Array<{ label: "HD"|"Full HD"|"2K"|"4K"|"Original"; url; width; height; type; ext }>;
  items?: Array<{ thumbnail; variants; kind }>;  // carousel/story
  source: string;
}
```

### `GET /api/download?url=<encoded>&filename=<name.ext>`

Streams the upstream Pinterest CDN file with `Content-Disposition: attachment` so the browser saves it directly. Allowlisted to `*.pinimg.com` / `*.pinterest.com`.

## ⚖️ Disclaimer

PinPeak is not affiliated with Pinterest, Inc. Respect creators' rights and Pinterest's Terms of Service. Use downloads only where you have permission.
