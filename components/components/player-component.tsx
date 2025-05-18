"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Duration } from "@/lib/duration";
import {
    Heart,
    Plus,
    ChevronDown,
    ChevronUp,
    SkipBack,
    Play,
    Pause,
    SkipForward,
} from "lucide-react";

export default function Player() {
    const [playerExpanded, setPlayerExpanded] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState([0]);
    const [player, setPlayer] = useState<any>(undefined);
    const [device, setDevice] = useState<string>("");
    const [isTrackReady, setIsTrackReady] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [trackData, setTrackData] = useState<{
        album: string;
        name: string;
        artists: string;
        duration_ms: number;
    } | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("spotify_access_token");
        if (!token) window.location.href = "/";
    }, [])

    const refreshToken = async () => {
        try {
            const refreshToken = localStorage.getItem("spotify_refresh_token");
            const response = await fetch("/api/refreshToken", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });
            const { access_token, expiration_time } = await response.json();
            localStorage.setItem("spotify_access_token", access_token);
            localStorage.setItem("spotify_token_expiration", expiration_time);
            return access_token;
        } catch (error) {
            console.error("Failed to refresh token:", error);
            window.location.href = "/";
            return null;
        }
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        const token = localStorage.getItem("spotify_access_token");
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const p = new window.Spotify.Player({
                name: "Web Playback SDK",
                getOAuthToken: (cb: any) => cb(token),
                volume: 0.2,
            });

            setPlayer(p);

            p.addListener("ready", ({ device_id }: any) => {
                setDevice(device_id);
            });
            p.addListener("player_state_changed", (state: any) => {
                if (!state) return;
                setIsPlaying(!state.paused);
                setProgress([(state.position / state.duration) * 100]);
                setCurrentTime(state.position);
            });
            p.connect();
        };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isPlaying && trackData) {
            interval = setInterval(() => {
                setCurrentTime((prev) => {
                    const newTime = prev + 1000;
                    const duration = trackData.duration_ms;

                    if (newTime >= duration) {
                        clearInterval(interval!);
                        setProgress([100]);
                        return duration;
                    }

                    setProgress([(newTime / duration) * 100]);
                    return newTime;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPlaying, trackData]);

    const handleSliderChange = async (value: number[]) => {
        if (!trackData || !player) return;
        const percent = value[0];
        const newTime = Math.floor((percent / 100) * trackData.duration_ms);
        setCurrentTime(newTime);
        setProgress([percent]);
        try {
            await player.seek(newTime);
        } catch {
            const newToken = await refreshToken();
            if (newToken) await player.seek(newTime);
        }
    };

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        const handleTrackChange = async (e: any) => {
            const newTrack = e.detail;
            const artistNames = (newTrack.artists as any[])
                .map((a) => a.name)
                .join(", ");

            setTrackData({
                album: newTrack.album?.images[1]?.url,
                name: newTrack.name,
                artists: artistNames,
                duration_ms: newTrack.duration_ms,
            });
            setCurrentTime(0);
            setProgress([0]);

            const token = localStorage.getItem("spotify_access_token");
            const { id } = newTrack;
            if (!token || !device || !id) return;

            await fetch(
                `https://api.spotify.com/v1/me/player/play?device_id=${device}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ uris: [`spotify:track:${id}`] }),
                }
            ).catch(async (err) => {
                const newToken = await refreshToken();
                if (newToken) {
                    await fetch(
                        `https://api.spotify.com/v1/me/player/play?device_id=${device}`,
                        {
                            method: "PUT",
                            headers: {
                                Authorization: `Bearer ${newToken}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ uris: [`spotify:track:${id}`] }),
                        }
                    );
                }
            });

            setIsTrackReady(true);
        };

        window.addEventListener("track-changed", handleTrackChange);
        return () => window.removeEventListener("track-changed", handleTrackChange);
    }, [device]);

    return (
        <div>
            <div
                className="flex items-center justify-between mb-4"
                onClick={() => setPlayerExpanded((v) => !v)}
            >
                <h2 className="text-lg font-semibold">Tocando agora</h2>
                <button className="text-muted-foreground text-xs hover:text-foreground">
                    {playerExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
            </div>

            <AnimatePresence mode="wait">
                {trackData && (
                    <motion.div
                        key={playerExpanded ? "expanded" : "compact"}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={
                            playerExpanded
                                ? "flex flex-col items-center text-center"
                                : "flex items-center gap-4"
                        }
                    >
                        <img
                            src={trackData.album}
                            alt="Capa do álbum"
                            width={playerExpanded ? 140 : 64}
                            height={playerExpanded ? 140 : 64}
                            className={playerExpanded ? "rounded-lg mb-4" : "rounded-md"}
                        />
                        <div
                            className={
                                playerExpanded ? "mb-1 w-full" : "flex flex-col flex-1"
                            }
                        >
                            <div
                                className={!playerExpanded ? "flex justify-between items-start" : ""}
                            >
                                <div>
                                    <h3 className="text-sm font-semibold leading-tight">
                                        {trackData.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {trackData.artists}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 justify-between w-full">
                                <p className="text-xs text-muted-foreground">{formatTime(currentTime)}</p>
                                <Slider
                                    className="w-full my-4"
                                    value={progress}
                                    onValueChange={handleSliderChange}
                                    max={100}
                                    step={1}
                                />
                                <p className="text-xs text-muted-foreground">
                                    <Duration time={trackData.duration_ms} />
                                </p>
                            </div>

                            <div className="flex justify-center gap-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Heart className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Like</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <SkipBack className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Previous</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="default"
                                                size="icon"
                                                onClick={async () => {
                                                    if (!player || !isTrackReady) return;
                                                    try {
                                                        await player.togglePlay();
                                                    } catch {
                                                        const newToken = await refreshToken();
                                                        if (newToken) await player.togglePlay();
                                                    }
                                                }}
                                            >
                                                {isPlaying ? (
                                                    <Pause className="w-4 h-4" />
                                                ) : (
                                                    <Play className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{isPlaying ? "Pause" : "Play"}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <SkipForward className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Next</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Add to a playlist</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
