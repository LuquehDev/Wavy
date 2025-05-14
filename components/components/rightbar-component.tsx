"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
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
  { id: "4", title: "Watermelon Sugar", artist: "Harry Styles" },
  { id: "5", title: "Peaches", artist: "Justin Bieber" },
  { id: "6", title: "Bad Guy", artist: "Billie Eilish" },
  { id: "7", title: "Dance Monkey", artist: "Tones and I" },
  { id: "8", title: "Senhorita", artist: "Shawn Mendes & Camila Cabello" },
];

function SortableItem({
  item,
}: {
  item: { id: string; title: string; artist: string };
}) {
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
      className="flex justify-between items-center text-sm text-muted-foreground hover:text-white hover:bg-muted px-3 py-2 rounded-md group"
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

export default function RightBar() {
  const [lyricsExpanded, setLyricsExpanded] = useState(false);
  const [queue, setQueue] = useState(initialQueue);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([25]);
  const [playerExpanded, setPlayerExpanded] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = queue.findIndex((item) => item.id === active.id);
      const newIndex = queue.findIndex((item) => item.id === over.id);
      setQueue(arrayMove(queue, oldIndex, newIndex));
    }
  };

  // Dinâmica da letra expandida
  const [lyricsHeight, setLyricsHeight] = useState("12rem"); // mais comprimido

  useEffect(() => {
    setLyricsHeight(lyricsExpanded ? "100%" : "12rem");
  }, [lyricsExpanded]);

  return (
    <aside className="flex flex-col justify-between overflow-hidden h-full lg:w-72 lg:min-w-72 xl:w-80 xl:min-w-80 bg-card text-foreground border-l rounded-2xl shadow-lg p-6">
      {/* Fila */}
      <div className="min-h-32 overflow-auto">
        <h2 className="text-lg font-semibold mb-4">Fila</h2>
        <DndContext
          id="fila"
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
            {playerExpanded ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {playerExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center text-center"
            >
              <Image
                src="/album.jpg"
                alt="Capa do álbum"
                width={140}
                height={140}
                className="rounded-lg mb-4 object-cover"
              />
              <div className="mb-1">
                <h3 className="text-md font-semibold leading-tight">
                  Nome da Música
                </h3>
                <p className="text-sm text-muted-foreground">Nome do Artista</p>
              </div>
              <div className="flex items-center gap-2 h-auto justify-between w-full">
                <p className="text-xs text-muted-foreground">00:00</p>
                <Slider
                  className="w-full my-4"
                  value={progress}
                  onValueChange={setProgress}
                  max={100}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">03:45</p>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
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
                        <SkipBack className="w-5 h-5" />
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
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5" />
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
                        <SkipForward className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Next</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to Playlist</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="compact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4"
            >
              <Image
                src="/album.jpg"
                alt="Capa do álbum"
                width={64}
                height={64}
                className="rounded-md object-cover"
              />
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold leading-tight">
                      Nome da Música
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Nome do Artista
                    </p>
                  </div>
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
                  </TooltipProvider>
                </div>

              <div className="flex items-center gap-1 h-auto justify-between w-full">
                <p className="text-xs text-muted-foreground">00:00</p>
                <Slider
                  className="w-full my-4"
                  value={progress}
                  onValueChange={setProgress}
                  max={100}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">03:45</p>
                
              </div>
                <div className="flex justify-between gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <SkipBack className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Previous</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="default"
                          size="icon"
                          onClick={() => setIsPlaying(!isPlaying)}
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{isPlaying ? "Pause" : "Play"}</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <SkipForward className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Next</p>
                      </TooltipContent>
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
          <p
            className={
              !lyricsExpanded
                ? "text-sm font-medium transition-all duration-200"
                : "text-lg font-semibold transition-all duration-200"
            }
          >
            Letra
          </p>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            {lyricsExpanded ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>
        </div>
        <div
          style={{ maxHeight: lyricsHeight }}
          className="transition-all duration-300 text-xs leading-snug text-muted-foreground overflow-y-auto"
        >
          🎶 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
          rhoncus quam in turpis fermentum, a bibendum nisl rutrum. Sed at diam
          erat. Vestibulum quis quam eget tortor porttitor laoreet sit amet vel
          leo. Curabitur nec gravida odio, in sagittis nulla. 🎶 🎶 Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Fusce rhoncus quam in
          turpis fermentum, a bibendum nisl rutrum. Sed at diam erat. Vestibulum
          quis quam eget tortor porttitor laoreet sit amet vel leo. Curabitur
          nec gravida odio, in sagittis nulla. 🎶 🎶 Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Fusce rhoncus quam in turpis fermentum, a
          bibendum nisl rutrum. Sed at diam erat. Vestibulum quis quam eget
          tortor porttitor laoreet sit amet vel leo. Curabitur nec gravida odio,
          in sagittis nulla. 🎶 🎶 Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Fusce rhoncus quam in turpis fermentum, a bibendum
          nisl rutrum. Sed at diam erat. Vestibulum quis quam eget tortor
          porttitor laoreet sit amet vel leo. Curabitur nec gravida odio, in
          sagittis nulla. 🎶 🎶 Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Fusce rhoncus quam in turpis fermentum, a bibendum
          nisl rutrum. Sed at diam erat. Vestibulum quis quam eget tortor
          porttitor laoreet sit amet vel leo. Curabitur nec gravida odio, in
          sagittis nulla. 🎶 🎶 Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Fusce rhoncus quam in turpis fermentum, a bibendum
          nisl rutrum. Sed at diam erat. Vestibulum quis quam eget tortor
          porttitor laoreet sit amet vel leo. Curabitur nec gravida odio, in
          sagittis nulla. 🎶 🎶 Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Fusce rhoncus quam in turpis fermentum, a bibendum
          nisl rutrum. Sed at diam erat. Vestibulum quis quam eget tortor
          porttitor laoreet sit amet vel leo. Curabitur nec gravida odio, in
          sagittis nulla. 🎶
        </div>
      </div>
    </aside>
  );
}
