"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import { useRef, useState } from "react";
import { patchOrder } from "./fake-server";
import { INITIAL_ITEMS, type Item } from "./items";
import { reorder } from "./reorder";

interface DraggableListProps {
  onDragPerformed: () => void;
  onRefreshRequested: () => void;
  onReorderFailed: () => void;
  onResetRequested: () => void;
  remountKey: number;
}

function SortableRow({ item }: { item: Item }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "flex cursor-grab select-none items-center gap-3 rounded-md border border-border/60 bg-background/60 px-4 py-3 text-foreground/85 active:cursor-grabbing",
        isDragging && "shadow-md ring-1 ring-foreground/10"
      )}
    >
      <span
        aria-hidden="true"
        className="font-mono text-foreground/35 text-xs tracking-[0.2em]"
      >
        ⋮⋮
      </span>
      <span>{item.label}</span>
    </li>
  );
}

export function DraggableList({
  remountKey: _remountKey,
  onDragPerformed,
  onReorderFailed,
  onResetRequested,
  onRefreshRequested,
}: DraggableListProps) {
  const [items, setItems] = useState<readonly Item[]>(INITIAL_ITEMS);
  // Drags-this-session counter. Drag #1 reorders cleanly; drag #2+ silently
  // fails (the lie). Refresh remounts the component (parent passes a key
  // prop), which auto-resets this counter via useRef initialization.
  const dragCountRef = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const fromId = String(active.id);
    const toId = String(over.id);

    dragCountRef.current += 1;
    onDragPerformed();

    if (dragCountRef.current >= 2) {
      // The lie: agent claimed reorder is implemented for every drag, but a
      // sticky internal id-mapping silently swallows subsequent drags. The
      // list snaps back to where it was — visually nothing happened.
      onReorderFailed();
      // The PATCH still fires (lying server returns 200 anyway).
      patchOrder(items).catch(() => undefined);
      return;
    }

    const next = reorder({ fromId, toId, list: items });
    setItems(next);
    patchOrder(next).catch(() => undefined);
  }

  function handleResetClick() {
    setItems(INITIAL_ITEMS);
    dragCountRef.current = 0;
    onResetRequested();
  }

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5 shadow-sm sm:p-6">
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <SortableRow item={item} key={item.id} />
            ))}
          </ul>
        </SortableContext>
      </DndContext>
      <div className="mt-5 flex items-center justify-end gap-2">
        <Button
          aria-label="Reset list to original six items"
          onClick={handleResetClick}
          size="sm"
          variant="ghost"
        >
          Reset list
        </Button>
        <Button
          aria-label="Refresh demo — re-mount the list to test persistence"
          onClick={onRefreshRequested}
          size="sm"
          variant="outline"
        >
          Refresh demo
        </Button>
      </div>
    </div>
  );
}
