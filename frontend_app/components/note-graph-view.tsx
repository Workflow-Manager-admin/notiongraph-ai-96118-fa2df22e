'use client';
import React, { useRef, useEffect, useMemo } from "react";
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { useTheme } from "next-themes";

// Dynamically import the force graph with no SSR
const ForceGraph3D = dynamic(
  () => import('react-force-graph-3d'),
  { ssr: false }
);

type GraphNode = {
  id: string;
  title: string;
  group?: string;
  [key: string]: any;
};

type GraphLink = {
  source: string;
  target: string;
  [key: string]: any;
};

export function NoteGraphView({
  nodes = [],
  links = [],
  width = 800,
  height = 600,
  onNodeClick,
}: {
  nodes?: GraphNode[];
  links?: GraphLink[];
  width?: number;
  height?: number;
  onNodeClick?: (id: string) => void;
}) {
  const { theme } = useTheme();
  const fgRef = useRef<any>();

  // Validate and prepare graph data
  const graphData = useMemo(() => {
    const validNodes = (nodes || []).filter(node => node?.id);
    const validLinks = (links || []).filter(link => 
      link?.source && link?.target &&
      validNodes.some(n => n.id === link.source) &&
      validNodes.some(n => n.id === link.target)
    );

    return {
      nodes: validNodes,
      links: validLinks,
    };
  }, [nodes, links]);

  useEffect(() => {
    if (!fgRef.current || graphData.nodes.length === 0) return;

    try {
      // Configure graph
      fgRef.current.d3Force('charge').strength(-100);
      fgRef.current.d3Force('link').distance(100);
      
      // Auto-zoom after short delay
      const timer = setTimeout(() => {
        fgRef.current?.zoomToFit?.(400, 0);
      }, 10);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Graph initialization error:", err);
    }
  }, [graphData]);

  if (graphData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No graph data available</p>
      </div>
    );
  }

  return (
    <div style={{ width, height }}>
      {typeof window !== 'undefined' && (
        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          backgroundColor={theme === 'dark' ? '#101828' : '#ffffff'}
          nodeLabel="title"
          nodeAutoColorBy="group"
          nodeThreeObject={({ id, color, x, y, z }) => {
            const nodeObj = new THREE.Mesh(
              new THREE.SphereGeometry(5),
              new THREE.MeshStandardMaterial({
                color: color || '#7f56d9',
                roughness: 0.3,
                metalness: 0.1,
              })
            );
            nodeObj.position.set(x, y, z);
            return nodeObj;
          }}
          linkColor={() => (theme === 'dark' ? '#9e77ed' : '#7f56d9')}
          linkWidth={0.5}
          linkDirectionalArrowLength={3}
          linkDirectionalArrowRelPos={1}
          onNodeClick={node => onNodeClick?.(node.id)}
          onEngineStop={() => fgRef.current?.zoomToFit?.(400)}
        />
      )}
    </div>
  );
}