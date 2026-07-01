"use client";

import { useEditor, useCurrentPage } from "@/lib/store/editor-store";
import { SectionRenderer } from "../sections/SectionRenderer";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export function Canvas() {
  const page = useCurrentPage();
  const { site, selectedSectionId, selectSection, reorderSections, device, setDevice } = useEditor();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  // Clear selection when clicking empty canvas
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) selectSection(null);
  };

  if (!page) {
    return (
      <div className="grid h-full place-items-center text-sm text-muted-foreground">
        No page selected
      </div>
    );
  }

  const widthClass =
    device === "mobile" ? "max-w-[420px]" : device === "tablet" ? "max-w-[820px]" : "max-w-full";

  return (
    <div
      className="relative h-full overflow-auto bg-muted/20"
      onClick={handleCanvasClick}
    >
      <div className={`mx-auto ${widthClass} transition-all duration-200`}>
        <div
          className="min-h-full shadow-xl"
          style={{
            background: site.themeTokens.background,
            fontFamily: site.themeTokens.font,
            color: site.themeTokens.foreground,
          }}
        >
          {page.sections.length === 0 ? (
            <EmptyState />
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e: DragEndEvent) => {
                const { active, over } = e;
                if (!over || active.id === over.id) return;
                const oldIndex = page.sections.findIndex((s) => s.id === active.id);
                const newIndex = page.sections.findIndex((s) => s.id === over.id);
                if (oldIndex === -1 || newIndex === -1) return;
                reorderSections(arrayMove(page.sections, oldIndex, newIndex));
              }}
            >
              <SortableContext
                items={page.sections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {page.sections.map((sec) => (
                  <SortableSection
                    key={sec.id}
                    sectionId={sec.id}
                    section={sec}
                    theme={site.themeTokens}
                    selected={selectedSectionId === sec.id}
                    onSelect={selectSection}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}

function SortableSection({
  sectionId,
  section,
  theme,
  selected,
  onSelect,
}: {
  sectionId: string;
  section: import("@/lib/sections/types").SectionInstance;
  theme: import("@/lib/sections/types").ThemeTokens;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sectionId,
  });
  const removeSection = useEditor((s) => s.removeSection);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className={`absolute right-1 top-1 z-20 grid h-7 w-7 cursor-grab place-items-center rounded-md bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-opacity active:cursor-grabbing ${
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        onClick={(e) => e.stopPropagation()}
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {/* Quick delete */}
      <button
        type="button"
        className={`absolute right-9 top-1 z-20 grid h-7 w-7 place-items-center rounded-md bg-background/90 text-destructive shadow-sm backdrop-blur transition-opacity hover:bg-destructive hover:text-destructive-foreground ${
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          removeSection(sectionId);
        }}
        title="Delete section"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      <div className="group">
        <SectionRenderer
          section={section}
          theme={theme}
          editable
          selected={selected}
          onSelect={onSelect}
        />
      </div>
    </div>
  );
}

function EmptyState() {
  const setView = useEditor((s) => s.setView);
  return (
    <div className="grid min-h-[60vh] place-items-center px-6 py-20 text-center">
      <div className="max-w-md space-y-4">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-muted">
          <Plus className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">This page is empty</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Add sections from the library on the left, or start from a template.
          </p>
        </div>
        <div className="flex justify-center gap-2">
          <Button onClick={() => setView("templates")}>
            <Plus className="mr-1 h-4 w-4" /> Browse templates
          </Button>
        </div>
      </div>
    </div>
  );
}
