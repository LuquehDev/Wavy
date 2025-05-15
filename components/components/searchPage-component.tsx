"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Play } from "lucide-react";

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
  const [tracks, setTracks] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchTracks = async () => {
    if (!inputValue) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/searchTracks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm: inputValue }),
      });

      const data = await res.json();
      setTracks(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-4 gap-6 overflow-auto">
      <div className="flex gap-2">
        <Input
          id="search"
          type="text"
          value={inputValue}
          placeholder="Digite algo..."
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button type="button" onClick={fetchTracks}>
          Enviar
        </Button>
      </div>

      {loading ? (
        <div className="flex w-full text-white justify-center items-center">
          <div className="loader mt-12" />
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4">
          {[...tracks]
            // .sort((a: any, b: any) => b.popularity - a.popularity)
            .map((track: any) => (
              <li
                key={track.id}
                className="flex items-center overflow-hidden gap-2 bg-transparent hover:bg-white/10 rounded pr-3 relative group"
              >
                <div>
                  <img
                    src={track.album.images[1]?.url}
                    alt={track.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </div>
                <div>
                  <p className="font-semibold">{track.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {track.artists[0].name}
                  </p>
                </div>
                <Duration time={track.duration_ms} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-16 bg-primary hover:bg-primary/80 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Play"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </li>
            ))}
        </ul>
      )}
 
      <div>
        <h1 className="text-white text-xl font-semibold mb-2">Seu Histórico de Busca</h1>
        <ul className="grid grid-cols-1 gap-4">
          <li className="bg-white/5 p-4 rounded-lg">Bom dia</li>
          <li className="bg-white/5 p-4 rounded-lg">Bom dia</li>
          <li className="bg-white/5 p-4 rounded-lg">Bom dia</li>
          <li className="bg-white/5 p-4 rounded-lg">Bom dia</li>
        </ul>
      </div>
    </div>
  );
}
