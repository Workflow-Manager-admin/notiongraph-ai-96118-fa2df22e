"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NoteGraphView } from "@/app/graph/components/note-graph-view";
import { useGraphModal } from "@/hooks/use-graph-modal";

/**
 * PUBLIC_INTERFACE
 * GraphModal - displays a mini interactive graph view in a modal dialog.
 * Uses Zustand store for open/close.
 */
export function GraphModal() {
  const { isOpen, close } = useGraphModal();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent
        className="max-w-2xl w-full p-3 rounded-xl shadow-xl"
        style={{
          minWidth: 370,
          minHeight: 278,
        }}
      >
        <DialogHeader className="mb-1">
          <DialogTitle className="text-base font-semibold">Note Graph</DialogTitle>
        </DialogHeader>
        <NoteGraphView mini />
      </DialogContent>
    </Dialog>
  );
}
