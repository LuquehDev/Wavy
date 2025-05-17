import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const verifier = searchParams.get('verifier');

  if (!code || !verifier) {
    return NextResponse.json(
      { error: 'Missing code or verifier' },
      { status: 400 }
    );
  }

  const params = new URLSearchParams();
  params.append('client_id', process.env.NEXT_PUBLIC_CLIENT_ID!);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.NEXT_PUBLIC_REDIRECT_URI!);
  params.append('code_verifier', verifier);

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: 'Spotify token error', details: data }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Erro ao obter token do Spotify:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
