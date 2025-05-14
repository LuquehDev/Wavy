"use client"

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { GripVertical } from "lucide-react"

interface QueueItem {
  id: string
  title: string
  artist: string
}

interface Props {
  queue: QueueItem[]
  onQueueChange: (newQueue: QueueItem[]) => void
}

function SortableItem({ item }: { item: QueueItem }) {
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

export default function SortableQueue({ queue, onQueueChange }: Props) {
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = queue.findIndex((item) => item.id === active.id)
      const newIndex = queue.findIndex((item) => item.id === over.id)
      const newQueue = arrayMove(queue, oldIndex, newIndex)
      onQueueChange(newQueue)
    }
  }

  return (
    <DndContext
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
  )
}
