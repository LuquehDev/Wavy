"use client";
import { Button } from "../ui/button";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Historico() {
    const [history, setHistory] = useState<any[]>([]);

    /* --------- lê o histórico --------- */
    useEffect(() => {
        const stored = localStorage.getItem("track_history");
        if (stored) setHistory(JSON.parse(stored));
    }, []);

    /* --------- limpar --------- */
    const clearHistory = () => {
        localStorage.removeItem("track_history");
        setHistory([]);
        window.dispatchEvent(
            new CustomEvent("track-history-changed", { detail: [] })
        );
    };

    /* --------- tocar / reordenar --------- */
    const handleTrackClick = (track: any) => {
        localStorage.setItem("actual_track", JSON.stringify(track));
        window.dispatchEvent(new CustomEvent("track-changed", { detail: track }));

        setHistory((prev) => {
            const idx = prev.findIndex((t) => t.id === track.id);
            if (idx === 0) return prev;

            let updated = idx > -1
                ? [prev[idx], ...prev.slice(0, idx), ...prev.slice(idx + 1)]
                : [track, ...prev];

            updated = updated.slice(0, 6);
            localStorage.setItem("track_history", JSON.stringify(updated));
            window.dispatchEvent(
                new CustomEvent("track-history-changed", { detail: updated })
            );
            return updated;
        });
    };

    /* --------- animação ---------- */
    const listVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.07 },
        }),
        exit: { opacity: 0, y: 20 },
    };

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className="text-white text-2xl font-bold mb-2">Seu Histórico</h1>
                <button
                    onClick={clearHistory}
                    className="text-white/65 hover:text-white/80 text-md font-medium mb-2"
                >
                    Limpar histórico
                </button>
            </div>

            {history.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma música tocada ainda.</p>
            ) : (
                <ul className="grid grid-cols-2 gap-4">
                    <AnimatePresence initial={true}>
                        {history.map((track, i) => (
                            <motion.li
                                key={track.id}
                                custom={history.length - 1 - i}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={listVariants}
                                className="flex items-center gap-2 bg-transparent hover:bg-white/5 hover:shadow-lg rounded pr-3 relative group transition-shadow overflow-hidden"
                            >
                                <img
                                    src={track?.album?.images?.[1]?.url || "/placeholder.png"}
                                    alt={track.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div className="max-w-[80%] overflow-hidden">
                                    <p className="font-semibold truncate">{track.name}</p>
                                    <p className="text-sm font-medium text-muted-foreground truncate">
                                        {track.artists?.[0]?.name}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleTrackClick(track)}
                                    className="absolute right-4 bg-primary hover:bg-primary/80 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Play"
                                >
                                    <Play className="w-4 h-4" />
                                </Button>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            )}
        </>
    );
}
