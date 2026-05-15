import { NextRequest, NextResponse } from "next/server";
import { extractPin } from "@/lib/pinterest";
import { cacheGet, cacheSet } from "@/lib/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }
    const key = `pin:${url}`;
    const cached = await cacheGet<any>(key);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }
    const data = await extractPin(url.trim());
    await cacheSet(key, data, 600);
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch pin" },
      { status: 400 }
    );
  }
}
