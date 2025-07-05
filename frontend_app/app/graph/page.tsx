"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { NoteGraphView } from "@/components/note-graph-view";

export default function GraphPage() {
  const { isLoaded } = useUser();
  const graphData = useQuery(api.documents.getGraphData);

  if (!isLoaded || !graphData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold mb-4">Note Graph</h1>
      <div className="border rounded-lg h-[600px]">
        <NoteGraphView
          nodes={graphData?.nodes || []}
          links={graphData?.links || []}
          onNodeClick={(id) => console.log("Selected node:", id)}
        />
      </div>
    </div>
  );
}
