'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

const REDIRECT_URI = 'http://127.0.0.1:3000';
const SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'streaming',
    'app-remote-control',
];


const AUTH_URL = `https://accounts.spotify.com/authorize?` +
    `client_id=${process.env.CLIENT_ID}` +
    `&response_type=token` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPES.join(' '))}`;

export default function SpotifyLogin() {
    const handleLogin = () => {
        window.location.href = AUTH_URL;
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
