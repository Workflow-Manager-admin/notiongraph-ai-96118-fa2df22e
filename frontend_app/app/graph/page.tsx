"use client";
import { NoteGraphView } from "./components/note-graph-view";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function GraphPage() {
  const { isLoaded, user } = useUser();
  const { data: graphData, isLoading, error } = useQuery(
    api.notes.getGraphData, 
    user ? { userId: user.id } : "skip"
  );

  if (!isLoaded || isLoading) {
    return <div className="flex-center h-screen"><Loader2 className="animate-spin" /></div>;
  }

  if (error) {
    return <div className="flex-center h-screen">Error loading graph data</div>;
  }

  return (
    <div className="container mx-auto p-4">
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