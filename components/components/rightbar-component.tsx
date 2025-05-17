"use client";

import { useEffect, useState } from "react";
import Player from "@/components/components/player-component";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";
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

export default function RightBar() {
  const [lyricsExpanded, setLyricsExpanded] = useState(false);
  const [queue, setQueue] = useState(initialQueue);
  const [trackData, setTrackData] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const [lyricsHeight, setLyricsHeight] = useState("12rem");

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = queue.findIndex((item) => item.id === active.id);
      const newIndex = queue.findIndex((item) => item.id === over.id);
      setQueue(arrayMove(queue, oldIndex, newIndex));
    }
  };

  useEffect(() => {
    const handleTrackChange = (e: any) => {
      const newTrack = e.detail;
      setTrackData(newTrack);
    };

    window.addEventListener("track-changed", handleTrackChange);
    return () => window.removeEventListener("track-changed", handleTrackChange);
  }, []);

  useEffect(() => {
    setLyricsHeight(lyricsExpanded ? "100%" : "12rem");
  }, [lyricsExpanded]);

  return (
    <aside className={trackData ? "flex flex-col justify-between overflow-hidden min-h-full h-full lg:w-72 lg:min-w-72 xl:w-80 xl:min-w-80 text-foreground p-6" : "hidden"}>
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
        <Player />
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