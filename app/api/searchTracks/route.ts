import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const searchTerm = body.searchTerm;

  if (!searchTerm) {
    return NextResponse.json({ error: "Search term is required." }, { status: 400 });
  }

  // 1. Autenticar com o Spotify usando client credentials
  const basic = Buffer.from(
    `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
  ).toString("base64");

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // 2. Buscar músicas com base no searchTerm
  const searchRes = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchTerm)}&type=track&limit=15`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await searchRes.json();
  const tracks = data.tracks.items;

  // 3. Retornar a resposta
  return NextResponse.json(tracks);
}
