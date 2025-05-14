"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
} from "@dnd-kit/core"
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { Slider } from "@/components/ui/slider"
import dynamic from "next/dynamic"

const SortableQueue = dynamic(() => import("@/components/components/sortableQueue"), { ssr: false })

const initialQueue = [
    { id: "1", title: "Música 1", artist: "Artista A" },
    { id: "2", title: "Música 2", artist: "Artista B" },
    { id: "3", title: "Música 3", artist: "Artista C" },
    { id: "4", title: "Música 4", artist: "Artista D" },
    { id: "5", title: "Música 4", artist: "Artista D" },
    { id: "6", title: "Música 4", artist: "Artista D" },
    { id: "7", title: "Música 4", artist: "Artista D" },
    { id: "8", title: "Música 4", artist: "Artista D" },
]

function SortableItem({ item }: { item: { id: string; title: string; artist: string } }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        setActivatorNodeRef,
    } = useSortable({ id: item.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex justify-between items-center text-sm text-muted-foreground hover:bg-muted px-3 py-2 rounded-md group"
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
    )
}

export default function RightBar() {
    const [lyricsExpanded, setLyricsExpanded] = useState(false)
    const [queue, setQueue] = useState(initialQueue)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState([25])

    const sensors = useSensors(useSensor(PointerSensor))

    const handleDragEnd = (event: any) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            const oldIndex = queue.findIndex((item) => item.id === active.id)
            const newIndex = queue.findIndex((item) => item.id === over.id)
            setQueue(arrayMove(queue, oldIndex, newIndex))
        }
    }

    // Dinâmica da letra expandida
    const [lyricsHeight, setLyricsHeight] = useState("3rem") // mais comprimido

    useEffect(() => {
        setLyricsHeight(lyricsExpanded ? "8rem" : "3rem")
    }, [lyricsExpanded])

    return (
        <aside className="flex flex-col justify-between h-full w-80 min-w-80 bg-card text-foreground border-l rounded-2xl shadow-lg p-6">
            {/* Fila */}
            <div className="max-h-82 overflow-auto">
                <h2 className="text-lg font-semibold mb-4">Fila</h2>
                <SortableQueue queue={queue} onQueueChange={setQueue} />
                <DndContext
                    id="fila"
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                >
                    <SortableContext items={queue.map((item) => item.id)} strategy={verticalListSortingStrategy}>
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
                <h2 className="text-lg font-semibold mb-4">Tocando agora</h2>
                <div className="flex flex-col items-center text-center">
                    <Image
                        src="/logo.png"
                        alt="Capa do álbum"
                        width={160}
                        height={160}
                        className="rounded-lg mb-4 object-cover"
                    />
                    <div className="mb-1">
                        <h3 className="text-md font-semibold leading-tight">Nome da Música</h3>
                        <p className="text-sm text-muted-foreground">Nome do Artista</p>
                    </div>

                    {/* Slider */}
                    <Slider
                        className="w-full my-4"
                        value={progress}
                        onValueChange={setProgress}
                        max={100}
                        step={1}
                    />

                    {/* Controles */}
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <Button variant="ghost" size="icon">
                            <SkipBack className="w-5 h-5" />
                        </Button>
                        <Button variant="default" size="icon" onClick={() => setIsPlaying(!isPlaying)}>
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </Button>
                        <Button variant="ghost" size="icon">
                            <SkipForward className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Like/Add */}
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="icon">
                            <Heart className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Letra */}
            <div>
                <Separator className="mb-2" />
                <div className="flex items-center justify-between mb-2">
                    <p className={!lyricsExpanded ? "text-sm font-medium transition-all duration-200" : "text-lg font-semibold transition-all duration-200"}>Letra</p>
                    <button
                        onClick={() => setLyricsExpanded(!lyricsExpanded)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {lyricsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
                <div
                    style={{ maxHeight: lyricsHeight }}
                    className="transition-all duration-300 text-xs leading-snug text-muted-foreground overflow-y-auto"
                >
                    🎶 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus
                    quam in turpis fermentum, a bibendum nisl rutrum. Sed at diam erat.
                    Vestibulum quis quam eget tortor porttitor laoreet sit amet vel leo.
                    Curabitur nec gravida odio, in sagittis nulla. 🎶
                    🎶 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus
                    quam in turpis fermentum, a bibendum nisl rutrum. Sed at diam erat.
                    Vestibulum quis quam eget tortor porttitor laoreet sit amet vel leo.
                    Curabitur nec gravida odio, in sagittis nulla. 🎶
                    🎶 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus
                    quam in turpis fermentum, a bibendum nisl rutrum. Sed at diam erat.
                    Vestibulum quis quam eget tortor porttitor laoreet sit amet vel leo.
                    Curabitur nec gravida odio, in sagittis nulla. 🎶
                    🎶 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus
                    quam in turpis fermentum, a bibendum nisl rutrum. Sed at diam erat.
                    Vestibulum quis quam eget tortor porttitor laoreet sit amet vel leo.
                    Curabitur nec gravida odio, in sagittis nulla. 🎶
                    🎶 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus
                    quam in turpis fermentum, a bibendum nisl rutrum. Sed at diam erat.
                    Vestibulum quis quam eget tortor porttitor laoreet sit amet vel leo.
                    Curabitur nec gravida odio, in sagittis nulla. 🎶
                    🎶 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus
                    quam in turpis fermentum, a bibendum nisl rutrum. Sed at diam erat.
                    Vestibulum quis quam eget tortor porttitor laoreet sit amet vel leo.
                    Curabitur nec gravida odio, in sagittis nulla. 🎶
                    🎶 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce rhoncus
                    quam in turpis fermentum, a bibendum nisl rutrum. Sed at diam erat.
                    Vestibulum quis quam eget tortor porttitor laoreet sit amet vel leo.
                    Curabitur nec gravida odio, in sagittis nulla. 🎶
                </div>
            </div>
        </aside>
    )
}
