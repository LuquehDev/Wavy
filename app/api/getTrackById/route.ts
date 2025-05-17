import { getAccessToken } from "@/lib/wavy";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const trackId = searchParams.get("trackId");

    if (!trackId) {
        return NextResponse.json({ error: "trackId is required" }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    try {
        const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch track data" }, { status: res.status });
        }

        const track = await res.json();

        return NextResponse.json({
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist: any) => artist.name).join(", "),
            albumImage: track.album.images?.[0]?.url,
            durationMs: track.duration_ms,
        });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}