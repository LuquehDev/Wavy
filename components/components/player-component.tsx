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
    const [playerExpanded, setPlayerExpanded] = useState(false);
    const [trackData, setTrackData] = useState<{ album: string; name: string; img: string; artists: string; duration_ms:number } | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState([0]);
    const [player, setPlayer] = useState(undefined);

    // useEffect(() => {
    //     const script = document.createElement("script");
    //     script.src = "https://sdk.scdn.co/spotify-player.js";
    //     script.async = true;

    //     document.body.appendChild(script);

    //     window.onSpotifyWebPlaybackSDKReady = () => {

    //         const player = new window.Spotify.Player({
    //             name: 'Web Playback SDK',
    //             getOAuthToken: cb => { cb(props.token); },
    //             volume: 0.5
    //         });

    //         setPlayer(player);

    //         player.addListener('ready', ({ device_id }) => {
    //             console.log('Ready with Device ID', device_id);
    //         });

    //         player.addListener('not_ready', ({ device_id }) => {
    //             console.log('Device ID has gone offline', device_id);
    //         });


    //         player.connect();

    //     };
    // }, []);

    useEffect(() => {
        const handleTrackChange = (e: any) => {
            const newTrack = e.detail;
            // Pegando apenas as propriedades desejadas
            const filteredTrack = {
                album: newTrack.album,
                img: newTrack.img,
                name: newTrack.name,
                artists: newTrack.artists,
                duration_ms: newTrack.duration_ms,
            };
            setTrackData(filteredTrack);
        };

        window.addEventListener("track-changed", handleTrackChange);
        return () => window.removeEventListener("track-changed", handleTrackChange);
    }, []);

    return (
        <div>
            <div
                className="flex items-center justify-between mb-4"
                onClick={() => setPlayerExpanded(!playerExpanded)}
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
                        className={`${playerExpanded
                            ? "flex flex-col items-center text-center"
                            : "flex items-center gap-4"
                            }`}
                    >
                        <img
                            src={trackData.album.images[1]?.url}
                            alt="Capa do álbum"
                            width={playerExpanded ? 140 : 64}
                            height={playerExpanded ? 140 : 64}
                            className={playerExpanded ? "rounded-lg mb-4" : "rounded-md"}
                        />
                        <div className={`${playerExpanded ? "mb-1 w-full" : "flex flex-col flex-1"}`}>
                            <div className={`${!playerExpanded ? "flex justify-between items-start" : ""}`}>
                                <div>
                                    <h3 className="text-sm font-semibold leading-tight">{trackData.name}</h3>
                                    <p className="text-xs text-muted-foreground">{trackData.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 justify-between w-full">
                                <p className="text-xs text-muted-foreground">00:00</p>
                                <Slider
                                    className="w-full my-4"
                                    value={progress}
                                    onValueChange={setProgress}
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
                                        <TooltipContent><p>Like</p></TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <SkipBack className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Previous</p></TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="default"
                                                size="icon"
                                                onClick={() => setIsPlaying(!isPlaying)}
                                            >
                                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>{isPlaying ? "Pause" : "Play"}</p></TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <SkipForward className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Next</p></TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent><p>Add to a playlist</p></TooltipContent>
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