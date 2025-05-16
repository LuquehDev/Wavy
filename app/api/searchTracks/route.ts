import { getAccessToken } from "@/lib/wavy";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { searchTerm } = await req.json();

  if (!searchTerm) {
    return NextResponse.json({ error: "Search term is required" }, { status: 400 });
  }
  const accessToken = await getAccessToken();
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    const trackRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=15`,
      { headers }
    );
    const trackData = await trackRes.json();
    const tracks = trackData.tracks?.items || [];

    const artistRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=artist&limit=4`,
      { headers }
    );
    const artistData = await artistRes.json();
    const artists = artistData.artists?.items || [];

    return NextResponse.json({ tracks, artists });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
