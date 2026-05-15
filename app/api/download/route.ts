import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Streaming proxy that forces a download with the chosen filename
 * and bypasses CORS limitations of pinimg/v.pinimg CDNs.
 *
 * Usage: /api/download?url=<encoded>&filename=pin.mp4
 */
export async function GET(req: NextRequest) {
  const u = req.nextUrl.searchParams.get("url");
  const filename = req.nextUrl.searchParams.get("filename") || "pinpeak-download";
  if (!u) return new NextResponse("Missing url", { status: 400 });

  let target: URL;
  try {
    target = new URL(u);
  } catch {
    return new NextResponse("Invalid url", { status: 400 });
  }
  // Allowlist Pinterest CDNs
  if (!/(pinimg\.com|pinterest\.com)$/i.test(target.hostname)) {
    return new NextResponse("Host not allowed", { status: 403 });
  }

  const upstream = await fetch(target.toString(), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      Accept: "*/*",
      Referer: "https://www.pinterest.com/",
    },
  });

  if (!upstream.ok || !upstream.body) {
    return new NextResponse(`Upstream error: ${upstream.status}`, {
      status: 502,
    });
  }

  const headers = new Headers();
  headers.set(
    "Content-Type",
    upstream.headers.get("content-type") || "application/octet-stream"
  );
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);
  headers.set(
    "Content-Disposition",
    `attachment; filename="${filename.replace(/[^\w.\- ]+/g, "_")}"`
  );
  headers.set("Cache-Control", "public, max-age=86400");

  return new NextResponse(upstream.body, { status: 200, headers });
}
