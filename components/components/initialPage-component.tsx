"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function InitialPage() {

  const [storedValue, setStoredValue] = useState<string | null>(null);

  useEffect(() => {
    const value = localStorage.getItem("track_history");
    if (!value) {
      setStoredValue(null);
      return;
    }
    setStoredValue(value || null);
  }, []);

  return (
    <div className="flex flex-col bg-[#020202] w-full h-full p-4 gap-1 overflow-auto">
      <h1 className="text-white text-2xl font-bold mb-2">Seu Histórico</h1>
      {(!storedValue || !JSON.parse(storedValue)) ? (
        <p className="text-muted-foreground">Nenhuma música tocada ainda.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4">
          {JSON.parse(storedValue).map((track: any) => (
            <li
              key={track.id}
              className="flex items-center overflow-hidden gap-2  bg-white/2 hover:bg-white/10 hover:shadow-lg rounded pr-3 relative group transition-shadow"
            >
              <div>
                <img
                  src={track.album.images[1]?.url}
                  alt={track.name}
                  className="w-20 h-20 object-cover rounded"
                />
              </div>
              <div className="max-w-[80%] overflow-hidden">
                <p className="font-semibold">{track.name}</p>
                <p className="text-sm font-medium text-muted-foreground">
                  {track.artists[0].name}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 bg-primary hover:bg-primary/80 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Play"
              >
                <Play className="w-4 h-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
