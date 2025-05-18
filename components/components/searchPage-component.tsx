"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Play, Search } from "lucide-react";
import Historico from "@/components/components/history-component";

function Duration({ time }: { time: number }) {
  const totalSeconds = Math.floor(time / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime =
    (minutes < 10 ? "0" : "") +
    minutes +
    ":" +
    (seconds < 10 ? "0" : "") +
    seconds;
  return (
    <p className="text-sm text-muted-foreground group-hover:text-white ml-auto">
      {formattedTime}
    </p>
  );
}

export default function SearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedHistory = localStorage.getItem("track_history");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
      window.dispatchEvent(new CustomEvent("track-history-changed", { detail: storedHistory }));
    }
  }, []);

  // useEffect(() => {
  //     localStorage.removeItem("track_history");

  // },[])

  const handleTrackClick = (track: any) => {
    localStorage.setItem("actual_track", JSON.stringify(track));
    window.dispatchEvent(new CustomEvent("track-changed", { detail: track }));

    setHistory((prev) => {
      const updated = [track, ...prev].slice(0, 6);
      const exists = prev.find((item) => item.id === track.id);
      if (exists) {
        if (prev === exists[0]) {
          return prev;
        }
        else {
          const idx = prev.findIndex((item) => item.id === track.id);
          if (idx > 0) {
            const reordered = [prev[idx], ...prev.slice(0, idx), ...prev.slice(idx + 1)];
            const updated = reordered.slice(0, 6);
            localStorage.setItem("track_history", JSON.stringify(updated));
            window.dispatchEvent(new CustomEvent("track-history-changed", { detail: updated }));
            return updated;
          }
        }
        return prev;
      };
      localStorage.setItem("track_history", JSON.stringify(updated));
      return updated;
    });
  };

  const fetchTracks = async () => {
    if (!inputValue) return;

    setLoading(true);
    try {
      const res = await fetch("/api/searchTracks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchTerm: inputValue }),
      });

      const data = await res.json();
      setTracks(data.tracks || []);
      setArtists(data.artists || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-[#020202] w-full h-full p-4 gap-6 overflow-auto">
      <div className="relative w-full">
        <Input
          id="search"
          type="text"
          value={inputValue}
          placeholder="Digite algo..."
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          type="button"
          onClick={fetchTracks}
          className="absolute rounded right-0 top-1/2 -translate-y-1/2"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-12">
        {loading ? (
          <div className="flex w-full text-white justify-center items-center">
            <div className="loader mt-12" />
          </div>
        ) : (
          <>
            {tracks.length > 0 && (
              <div>
                <h1 className="text-white text-2xl font-bold mb-4">
                  Seus resultados:
                </h1>
                <ul className="grid grid-cols-1 gap-4">
                  {tracks
                    // .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                    .map((track: any) => (
                      <li
                        key={track.id}
                        className="flex items-center overflow-hidden gap-2 bg-transparent hover:bg-white/5 hover:shadow-lg rounded pr-3 relative group transition-shadow"
                      >
                        <div>
                          <img
                            src={track.album.images[1]?.url}
                            alt={track.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                        </div>
                        <div className="max-w-[80%] h-full overflow-hidden">
                          <p className="font-semibold">{track.name}</p>
                          <p className="text-sm font-medium text-muted-foreground">
                            {track.artists[0].name}
                          </p>
                          {track.explicit && (
                            <span className="text-xs text-white font-semibold bg-white/20 rounded px-2 py-1">
                              E
                            </span>
                          )}
                        </div>
                        <Duration time={track.duration_ms} />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            handleTrackClick(track);
                          }}
                          className="absolute right-16 bg-primary hover:bg-primary/80 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Play"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {artists.length > 0 && (
              <div>
                <h1 className="text-white text-2xl font-bold mb-4">
                  Artistas relacionados:
                </h1>
                <div className="grid grid-cols-3 xl:grid-cols-5 gap-4">
                  {artists
                    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
                    .map((artist: any) => (
                      <div
                        key={artist.id}
                        className="bg-white/2 rounded-xl p-4 flex flex-col items-center gap-4 hover:bg-white/5 hover:shadow-lg transition-shadow"
                      >
                        <img
                          src={artist.images[0]?.url || "/placeholder.png"}
                          alt={artist.name}
                          className="w-36 h-36 object-cover rounded-full"
                        />
                        <div className="flex flex-col w-full items-start">
                          <div className="flex flex-col overflow-hidden">
                            <p className="font-semibold text-xl truncate">
                              {artist.name}
                            </p>
                            <p className="text-lg font-semibold text-muted-foreground">
                              Artista ·{" "}
                              <span className="text-xs text-muted-foreground mt-1 italic">
                                {artist.followers.total} seguidores
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}

        <div>
          <Historico/>
        </div>
      </div>
    </div>
  );
}
