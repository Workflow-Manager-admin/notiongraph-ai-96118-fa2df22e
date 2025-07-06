'use client';

import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

// Dynamically import ForceGraph3D with SSR disabled
const ForceGraph3D = dynamic(
  () => import('react-force-graph-3d').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        Loading graph...
      </div>
    ),
  }
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

interface NoteGraphViewProps {
  nodes?: GraphNode[];
  links?: GraphLink[];
  width?: number;
  height?: number;
  onNodeClick?: (id: string) => void;
  mini?: boolean;
}

export function NoteGraphView({
  nodes = [],
  links = [],
  width = 800,
  height = 600,
  onNodeClick,
  mini = false,
}: NoteGraphViewProps) {
  const { theme } = useTheme();
  const fgRef = useRef<any>(null);

  const graphData = useMemo(() => {
    const validNodes = (nodes || []).filter(
      (node): node is GraphNode => !!node?.id
    );
    const validLinks = (links || []).filter(
      (link): link is GraphLink =>
        !!link?.source &&
        !!link?.target &&
        validNodes.some((n) => n.id === link.source) &&
        validNodes.some((n) => n.id === link.target)
    );

    return {
      nodes: validNodes,
      links: validLinks,
    };
  }, [nodes, links]);

  const handleStopSpeaking = useCallback(() => {
    // add logic if needed
  }, []);

  useEffect(() => {
    if (!fgRef.current || graphData.nodes.length === 0) return;

    try {
      fgRef.current.d3Force('charge')?.strength(-100);
      fgRef.current.d3Force('link')?.distance(100);

      const timer = setTimeout(() => {
        fgRef.current?.zoomToFit?.(400, 0);
      }, 10);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error('Graph initialization error:', err);
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
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        backgroundColor={theme === 'dark' ? '#101828' : '#ffffff'}
        nodeLabel="title"
        nodeAutoColorBy="group"
        nodeThreeObject={(node: any) => {
          const { color } = node;
          const x = node.x ?? 0;
          const y = node.y ?? 0;
          const z = node.z ?? 0;

          const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(5),
            new THREE.MeshStandardMaterial({
              color: color || '#7f56d9',
              roughness: 0.3,
              metalness: 0.1,
            })
          );

          mesh.position.set(x, y, z);
          return mesh;
        }}
        linkColor={() => (theme === 'dark' ? '#9e77ed' : '#7f56d9')}
        linkWidth={0.5}
        linkDirectionalArrowLength={3}
        linkDirectionalArrowRelPos={1}
        onNodeClick={(node: any) => {
          if (typeof node.id === 'string') {
            onNodeClick?.(node.id);
          }
        }}
        onEngineStop={() => fgRef.current?.zoomToFit?.(400)}
      />
    </div>
  );
}
