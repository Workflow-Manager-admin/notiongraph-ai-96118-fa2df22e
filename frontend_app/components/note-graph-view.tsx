"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import React, { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

type NoteNode = {
  id: string;
  title: string;
  icon?: string;
  parentId?: string | null;
};

type NoteEdge = {
  source: string;
  target: string;
};

interface NoteGraphViewProps {
  width?: number;
  height?: number;
  mini?: boolean;
}

function getGraphData(notes: Doc<"documents">[]): { nodes: NoteNode[]; edges: NoteEdge[] } {
  const nodes: NoteNode[] = notes.map((d) => ({
    id: d._id,
    title: d.title,
    icon: d.icon,
    parentId: d.parentDocument,
  }));

  const edges: NoteEdge[] = [];
  notes.forEach((note) => {
    if (note.parentDocument) {
      edges.push({
        source: note.parentDocument,
        target: note._id,
      });
    }
  });
  return { nodes, edges };
}

/**
 * PUBLIC_INTERFACE
 * NoteGraphView - main interactive graph visualization for notes and their relations.
 * Shows backlink/parent-child structure, supports click-to-center, smooth transitions.
 */
export function NoteGraphView({ width = 700, height = 500, mini = false }: NoteGraphViewProps) {
  // Fetch all documents for the current user (not archived)
  const documents = useQuery(api.documents.getSearch);

  const svgRef = useRef<SVGSVGElement>(null);
  const [centerNodeId, setCenterNodeId] = React.useState<string | null>(null);

  // Build the graph data
  const { nodes, edges } = React.useMemo(
    () => getGraphData(documents || []),
    [documents]
  );

  // Center on the last note created by default, else first
  useEffect(() => {
    if (nodes.length > 0 && !centerNodeId) {
      setCenterNodeId(nodes[nodes.length - 1].id);
    }
  }, [nodes, centerNodeId]);

  // Simple tree/graph layout (vertical "hive") for now, could use force-directed if needed
  function layoutNodes(nodes: NoteNode[], centerId: string | null) {
    const radius = mini ? 120 : 210;
    const spread = mini ? 1.25 : 1.6;
    const cx = width / 2,
      cy = height / 2;

    // Sort: direct children/links around center, others farther out
    const centerIndex = nodes.findIndex((n) => n.id === centerId);
    if (centerIndex === -1 || !centerId) {
      return {};
    }

    const center = nodes[centerIndex];
    // Children: nodes with parentId === centerId
    const children = nodes.filter((n) => n.parentId === centerId);
    // Parents: the parent, if present
    const parent = nodes.find((n) => n.id === center.parentId);

    // Remainings: others
    const others = nodes.filter(
      (n) => n.id !== centerId && n.parentId !== centerId && n.id !== center.parentId
    );

    const nodePositions: Record<string, { x: number; y: number }> = {};

    // Place center
    nodePositions[centerId] = { x: cx, y: cy };

    // Place parent (above center node)
    if (parent) {
      nodePositions[parent.id] = { x: cx, y: cy - radius * spread };
    }

    // Place children around center in circle
    for (let i = 0; i < children.length; ++i) {
      const angle = (i / Math.max(1, children.length)) * Math.PI * 2;
      nodePositions[children[i].id] = {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    }

    // Place others in outer ring
    for (let i = 0; i < others.length; ++i) {
      const angle = (i / Math.max(1, others.length)) * Math.PI * 2;
      nodePositions[others[i].id] = {
        x: cx + radius * 2 * Math.cos(angle),
        y: cy + radius * 2 * Math.sin(angle),
      };
    }

    return nodePositions;
  }

  const position = layoutNodes(nodes, centerNodeId);

  // Get node by id
  const getNode = useCallback((id: string) => nodes.find((n) => n.id === id), [nodes]);

  // Render loading/skeleton if needed
  if (!documents)
    return (
      <div className="flex items-center justify-center h-full w-full text-muted-foreground">
        Loading graph...
      </div>
    );

  return (
    <div
      className={
        "relative select-none bg-background border rounded-lg shadow-sm flex items-center justify-center " +
        (mini ? "p-2" : "p-6")
      }
      style={{
        width: mini ? 330 : width,
        height: mini ? 240 : height,
        minWidth: mini ? 330 : 350,
        minHeight: mini ? 240 : 320,
      }}
    >
      <svg
        ref={svgRef}
        width={mini ? 320 : width}
        height={mini ? 220 : height}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Edges */}
        {edges.map((edge, idx) => {
          const source = position[edge.source];
          const target = position[edge.target];
          if (!source || !target) return null;
          return (
            <motion.line
              key={idx}
              x1={source.x}
              y1={source.y}
              x2={target.x}
              y2={target.y}
              stroke="#b3b3b3"
              strokeWidth={centerNodeId === edge.target ? 3 : 1.3}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const pos = position[node.id];
          if (!pos)
            return null;
          const isCenter = node.id === centerNodeId;
          return (
            <g
              key={node.id}
              onClick={(e) => {
                e.stopPropagation();
                setCenterNodeId(node.id);
              }}
              style={{ cursor: "pointer" }}
            >
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isCenter ? 24 : 16}
                fill={
                  isCenter
                    ? "url(#activeGradient)"
                    : "url(#inactiveGradient)"
                }
                stroke={isCenter ? "#2563eb" : "#cbd5e1"}
                strokeWidth={isCenter ? 2.7 : 1}
                initial={{
                  filter: isCenter ? "drop-shadow(0 0 10px #2563eb80)" : undefined,
                  opacity: 0.5,
                }}
                animate={{
                  opacity: 1,
                  filter: isCenter ? "drop-shadow(0 0 12px #2563ebcc)" : undefined,
                }}
                transition={{ duration: 0.33 }}
              />
              <text
                x={pos.x}
                y={pos.y + (isCenter ? 3 : 3)}
                textAnchor="middle"
                fontSize={isCenter ? 16 : 12}
                fill={isCenter ? "#fff" : "#334155"}
                fontWeight={isCenter ? "bold" : undefined}
                style={{
                  pointerEvents: "none",
                  userSelect: "none",
                  fontFamily: "inherit",
                }}
              >
                {node.icon ? `${node.icon} ` : ""}
                {node.title.length > (isCenter ? 14 : 9)
                  ? node.title.slice(0, isCenter ? 12 : 8) + "…"
                  : node.title}
              </text>
            </g>
          );
        })}

        {/* SVG Gradients */}
        <defs>
          <radialGradient id="activeGradient" cx="60%" cy="50%" r="76%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.82" />
          </radialGradient>
          <radialGradient id="inactiveGradient" cx="60%" cy="50%" r="77%">
            <stop offset="0%" stopColor="#e2e8f0" stopOpacity="1" />
            <stop offset="95%" stopColor="#f8fafc" stopOpacity="0.85" />
          </radialGradient>
        </defs>
      </svg>
      {!mini && (
        <div className="absolute bottom-2 left-2 text-xs text-muted-foreground pointer-events-none">
          Click a node to center; larger circle is your anchor note.
        </div>
      )}
    </div>
  );
}
