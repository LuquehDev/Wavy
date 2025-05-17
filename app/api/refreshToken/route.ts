// app/api/refreshToken/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Validação básica do refresh_token
  const { refresh_token } = await req.json();
  if (!refresh_token) {
    return NextResponse.json(
      { error: 'Refresh token é obrigatório' },
      { status: 400 }
    );
  }

  // Configuração dos parâmetros para o Spotify
  const params = new URLSearchParams();
  params.append('client_id', process.env.CLIENT_ID!);
  params.append('client_secret', process.env.CLIENT_SECRET!);
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refresh_token);

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    // Tratamento de erros do Spotify
    if (!response.ok) {
      return NextResponse.json(
        { 
          error: 'Erro ao renovar token',
          details: data 
        },
        { status: response.status }
      );
    }

    // Calcula o tempo de expiração (timestamp em milissegundos)
    const expiresIn = data.expires_in * 1000; // Convertendo segundos para ms
    const expirationTime = Date.now() + expiresIn;

    // Estrutura de resposta com dados para cache
    const responseData = {
      access_token: data.access_token,
      expires_in: data.expires_in,
      expiration_time: expirationTime
    };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': 'no-store', // Para evitar cache indesejado
      },
    });

  } catch (err) {
    console.error('Erro na renovação do token:', err);
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}