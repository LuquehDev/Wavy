"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function InitialPage() {
  const [inputValue, setInputValue] = useState("");
  const [tracks, setTracks] = useState([]);

  const fetchTracks = async () => {
    const res = await fetch("/api/searchTracks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchTerm: inputValue }),
    });

    const data = await res.json();
    setTracks(data);
  };

  return (
    <div className="flex flex-col w-full h-full p-4 space-y-4">
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

      <ul>
        {tracks.map((track: any) => (
          <li key={track.id}>
            {track.name} - {track.artists[0].name}
          </li>
        ))}
      </ul>
    </div>
  );
}
