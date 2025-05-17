'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generatePKCE } from '@/lib/pkce';
import { Button } from '@/components/ui/button';

const SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'streaming',
    'app-remote-control',
];

const REDIRECT_URI = 'http://127.0.0.1:3000';

export default function SpotifyLogin() {
    const router = useRouter();

    // Detecta se estamos voltando do Spotify com o code
    useEffect(() => {
        const exchangeToken = async () => {
            const code = new URLSearchParams(window.location.search).get('code');
            const verifier = localStorage.getItem('spotify_pkce_verifier');

            if (!code || !verifier) return;

            try {
                const res = await fetch(`/api/getToken?code=${encodeURIComponent(code)}&verifier=${encodeURIComponent(verifier)}`);
                if (!res.ok) {
                    const errorText = await res.text(); // <- Adicionado para ver o erro
                    console.error(`Erro ao trocar token: ${res.status}`, errorText);
                    throw new Error('Falha na troca do token');
                }
                const data = await res.json();

                localStorage.setItem('spotify_access_token', data.access_token);

                // Remove o código da URL
                window.history.replaceState(null, '', window.location.pathname);

                // Redireciona para /home
                router.replace('/home');
            } catch (err) {
                console.error(err);
            }
        };

        exchangeToken();
    }, [router]);

    // Inicia o login com PKCE
    const handleLogin = async () => {
        const { codeVerifier, codeChallenge } = await generatePKCE();
        localStorage.setItem('spotify_pkce_verifier', codeVerifier);

        const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
        if (!clientId) {
            console.error('NEXT_PUBLIC_CLIENT_ID não está definido');
            return;
        }

        const authUrl = `https://accounts.spotify.com/authorize?` +
            `client_id=${encodeURIComponent(clientId)}` +
            `&response_type=code` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
            `&code_challenge_method=S256` +
            `&code_challenge=${encodeURIComponent(codeChallenge)}` +
            `&scope=${encodeURIComponent(SCOPES.join(' '))}`;

        window.location.href = authUrl;
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-black">
            <div className="flex flex-col items-center gap-6">
                <h1 className="text-3xl text-white font-bold">Entrar com Spotify</h1>
                <Button onClick={handleLogin} className="bg-green-500 hover:bg-green-600 text-white">
                    Conectar com Spotify
                </Button>
            </div>
        </div>
    );
}
