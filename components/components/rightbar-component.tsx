"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Plus,
  ChevronDown,
  ChevronUp,
  GripVertical,
  SkipBack,
  Play,
  Pause,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const initialQueue = [
  { id: "1", title: "Shape of You", artist: "Ed Sheeran" },
  { id: "2", title: "Blinding Lights", artist: "The Weeknd" },
  { id: "3", title: "Levitating", artist: "Dua Lipa" },
];

function SortableItem({ item }: { item: { id: string; title: string; artist: string } }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center rounded-md text-sm text-muted-foreground hover:text-white hover:bg-white/10 px-3 py-2 group"
    >
      <div>
        <p className="font-medium">{item.title}</p>
        <p className="text-xs">{item.artist}</p>
      </div>
      <div
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
        className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="w-4 h-4" />
      </div>
    </div>
  );
}

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

export default function RightBar({ trackId }: { trackId: string }) {
  const [lyricsExpanded, setLyricsExpanded] = useState(false);
  const [queue, setQueue] = useState(initialQueue);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [playerExpanded, setPlayerExpanded] = useState(false);
  const [trackData, setTrackData] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = queue.findIndex((item) => item.id === active.id);
      const newIndex = queue.findIndex((item) => item.id === over.id);
      setQueue(arrayMove(queue, oldIndex, newIndex));
    }
  };

  const [lyricsHeight, setLyricsHeight] = useState("12rem");

  useEffect(() => {
    const handleTrackChange = (e: any) => {
      const newTrack = e.detail;
      setTrackData(newTrack);
      console.log(JSON.stringify(newTrack))
    };

    window.addEventListener("track-changed", handleTrackChange);
    return () => window.removeEventListener("track-changed", handleTrackChange);
  }, []);

  useEffect(() => {
    setLyricsHeight(lyricsExpanded ? "100%" : "12rem");
  }, [lyricsExpanded]);

  return (
    <aside className="flex flex-col justify-between overflow-hidden min-h-full h-full lg:w-72 lg:min-w-72 xl:w-80 xl:min-w-80 text-foreground p-6">
      {/* Fila */}
      <div className="min-h-32 overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Fila</h2>
        <DndContext
          id="list"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={queue.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {queue.map((item) => (
                <SortableItem key={item.id} item={item} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Player */}
      <div className="my-6">
        <Separator className="mb-4" />
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
                    <p className="text-xs text-muted-foreground">{trackData.artists[0].name}</p>
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
                  <Duration time={trackData.duration_ms} />
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

      {/* Letra */}
      <div className="flex flex-col overflow-auto">
        <Separator className="mb-2" />
        <div
          className="flex items-center justify-between mb-2"
          onClick={() => setLyricsExpanded(!lyricsExpanded)}
        >
          <p className={`transition-all duration-200 ${lyricsExpanded ? "text-lg font-semibold" : "text-sm font-medium"}`}>
            Letra
          </p>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            {lyricsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        <div
          style={{ maxHeight: lyricsHeight }}
          className="transition-all duration-300 text-xs leading-snug text-muted-foreground overflow-y-auto"
        >
          {/* Letra placeholder */}
          🎶 Lorem ipsum dolor sit amet... 🎶
        </div>
      </div>
    </aside>
  );
}