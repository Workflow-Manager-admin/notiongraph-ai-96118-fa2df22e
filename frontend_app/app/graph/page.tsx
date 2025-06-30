"use client";

import React from "react";
import { NoteGraphView } from "@/components/note-graph-view";

/**
 * PUBLIC_INTERFACE
 * /graph page route: renders the interactive graph view of note relationships.
 * Must be authenticated to view.
 */
export default function GraphPage() {
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center bg-background"
      style={{ overflow: "auto" }}
    >
      <div className="max-w-4xl w-full flex flex-col items-center p-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 mt-8">Note Graph</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Interactive map of your notes and their relationships.
        </p>
        <NoteGraphView width={900} height={550} />
      </div>
    </div>
  );
}
