"use client";

import React, { useRef, useEffect, useCallback, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, extend, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useWindowSize } from "usehooks-ts";
import { Doc } from "@/convex/_generated/dataModel";
import * as THREE from "three";

// Type for a node (note) in the graph
type GraphNode = {
  id: string;
  title: string;
  position: [number, number, number];
  backlinks: string[]; // list of node ids that link to this note
  links: string[];     // list of node ids this note links to
  icon?: string;
};

// Type for a graph edge
type GraphEdge = {
  source: string;
  target: string;
};

// Generate random 3D positions for nodes
function generatePositions(n: number, radius = 16): [number, number, number][] {
  // Space them out in a sphere
  // Use Golden Section Spiral for uniform globe distribution
  const points: [number, number, number][] = [];
  const inc = Math.PI * (3 - Math.sqrt(5));
  const offset = 2 / n;
  for (let k = 0; k < n; ++k) {
    const y = k * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = k * inc;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;
    points.push([
      x * radius + (Math.random() - 0.5) * 3,
      y * radius + (Math.random() - 0.5) * 3,
      z * radius + (Math.random() - 0.5) * 3
    ]);
  }
  return points;
}

// Style colors—space theme neon
const COLORS = {
  node: "#5eeaff",
  nodeSelected: "#fedc69",
  nodeText: "#ffffff",
  link: "#8b99ff",
  nodeGlow: "#b1faff",
  starfield: "#141624",
};

import type { PointerEvent as ReactPointerEvent } from "react";
// Node rendering as a glowing sphere with an icon/text overlay
const NodeMesh = React.memo(function NodeMesh({
  node,
  selected,
  onClick,
  onPointerOver,
  onPointerOut,
  dragging,
}: {
  node: GraphNode;
  selected: boolean;
  onClick: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOver: (e: ThreeEvent<PointerEvent>) => void;
  onPointerOut: (e: ThreeEvent<PointerEvent>) => void;
  dragging: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Subtle "breathing" animation for nodes
  useFrame((_, delta) => {
    if (meshRef.current) {
      const scale = 1 + 0.07 * Math.sin(Date.now() * 0.002 + parseInt(node.id, 36) % 100);
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        castShadow
        scale={selected ? 1.21 : 1.0}
      >
        <sphereGeometry args={[0.88, 24, 24]} />
        <meshPhongMaterial
          color={selected ? COLORS.nodeSelected : COLORS.node}
          emissive={selected ? COLORS.nodeSelected : COLORS.nodeGlow}
          emissiveIntensity={selected ? 0.8 : 0.4}
          shininess={64}
          transparent
          opacity={dragging && selected ? 0.8 : 1}
        />
      </mesh>
      <Html
        center
        style={{
          width: 110,
          left: "-50px",
          top: "-14px",
          pointerEvents: "none",
          textAlign: "center",
          filter: selected ? "drop-shadow(0 0 12px #eab308)" : "drop-shadow(0 0 7px #004dd5)",
          zIndex: 100,
        }}
      >
        <div style={{
          color: selected ? "#fedc69" : "#d6f5ff",
          fontWeight: 700,
          fontSize: "16px",
          background: "rgba(14,18,24,.60)",
          borderRadius: 14,
          padding: "2px 8px",
          lineHeight: 1.3,
          userSelect: "none",
          letterSpacing: 0.05,
        }}>
          {node.icon && (<span style={{ fontSize: 20, marginRight: 6 }}>{node.icon}</span>)}
          {node.title}
        </div>
      </Html>
    </group>
  );
});

// Edge rendering as a shimmering/animated line
function EdgeLine({ source, target, highlight }: { source: [number, number, number]; target: [number, number, number]; highlight?: boolean }) {
  const ref = useRef<THREE.Line>(null);

  // Refs for geometry/material
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setFromPoints([
        new THREE.Vector3(...source),
        new THREE.Vector3(...target),
      ]);
    }
  }, [source, target]);

  // Animate material color along link if highlight
  useFrame((state) => {
    if (materialRef.current && highlight) {
      const t = (Math.sin(state.clock.elapsedTime * 2) + 1) / 2;
      materialRef.current.color.setRGB(1, t, 0.3 + 0.5 * t);
    }
  });

  // This uses primitive so TS doesn't confuse line with SVG
  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.setFromPoints([
        new THREE.Vector3(...source),
        new THREE.Vector3(...target),
      ]);
    }
  }, [source, target]);

  // Construct the line object in three.js, but let react-three-fiber manage it
  const lineObj = useMemo(() => {
    if (geometryRef.current && materialRef.current) {
      return new THREE.Line(geometryRef.current, materialRef.current);
    }
    return null;
  }, [source, target, highlight]);

  return (
    <primitive
      object={new THREE.Line(
        (() => {
          const geo = new THREE.BufferGeometry();
          geo.setFromPoints([
            new THREE.Vector3(...source),
            new THREE.Vector3(...target),
          ]);
          return geo;
        })(),
        (() => {
          const mat = new THREE.LineBasicMaterial({
            color: highlight ? "#fedc69" : COLORS.link,
            linewidth: highlight ? 2.5 : 1.3,
            transparent: true,
            opacity: highlight ? 0.88 : 0.43,
          });
          return mat;
        })()
      )}
      // It's fine to not use ref here as we do not mutate the line object in-place.
    />
  );
}

// Main 3D Graph component
type GraphViewProps = {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedNodeId?: string;
  onNodeSelect: (id: string | null) => void;
  onNodeOpen: (id: string) => void;
};

export const GraphView = ({
  nodes,
  edges,
  selectedNodeId,
  onNodeSelect,
  onNodeOpen,
}: GraphViewProps) => {
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const [hoverNode, setHoverNode] = useState<string | null>(null);

  // Represents the node graph in a [id, node] map for fast lookup
  const nodeMap: Record<string, GraphNode> = Object.fromEntries(nodes.map(n => [n.id, n]));
  // Map node id to position in 3D
  const positions: Record<string, [number, number, number]> = nodes.reduce((acc, node) => {
    acc[node.id] = node.position;
    return acc;
  }, {} as Record<string, [number, number, number]>);

  // Drag handling in 3D
  const handlePointerDown = (nodeId: string, e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDragNodeId(nodeId);
    setDragging(false);
    onNodeSelect(nodeId);
    document.body.style.cursor = "grab";
  };

  const handlePointerUp = (nodeId: string, e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setDragging(false);
    setDragNodeId(null);
    document.body.style.cursor = "default";
  };

  // Node dragging (moves in "screen space" projected into 3D)
  const handlePointerMove = (nodeId: string, e: ThreeEvent<PointerEvent>) => {
    if (dragNodeId === nodeId && e.unprojectedPoint) {
      setDragging(true);
      // Move node in graph in 3D
      nodeMap[nodeId].position[0] = e.unprojectedPoint.x;
      nodeMap[nodeId].position[1] = e.unprojectedPoint.y;
      nodeMap[nodeId].position[2] = e.unprojectedPoint.z;
    }
  };

  // Node interactions
  const handleNodeClick = (nodeId: string, e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (dragging) return; // don't open on drag
    onNodeOpen(nodeId);
  };

  // Reset cursor on empty area
  const handleCanvasPointerMissed = useCallback(() => {
    onNodeSelect(null);
    setHoverNode(null);
  }, [onNodeSelect]);

  return (
    <Canvas
      onPointerMissed={handleCanvasPointerMissed}
      camera={{ position: [0, 0, 31], fov: 60, near: 0.1, far: 220 }}
      style={{ width: "100%", height: "100vh", background: COLORS.starfield }}
    >
      <color attach="background" args={[COLORS.starfield]} />
      <ambientLight intensity={0.23} color="#63fcff" />
      <directionalLight position={[7, 13, 14]} intensity={0.63} castShadow color="#d0fcfd" />
      <Stars radius={100} depth={70} count={1800} factor={2.6} fade speed={2} saturation={1.1} />
      <OrbitControls
        enablePan
        enableZoom
        zoomSpeed={0.6}
        enableRotate
        minPolarAngle={0.37}
        maxPolarAngle={Math.PI - 0.37}
        minDistance={10}
        maxDistance={66}
        enableDamping
        dampingFactor={0.18}
        makeDefault
      />
      {/* Draw edges */}
      {edges.map((edge, i) => (
        <EdgeLine
          key={edge.source + "->" + edge.target + "-" + i}
          source={positions[edge.source]}
          target={positions[edge.target]}
          highlight={
            !!(selectedNodeId && (edge.source === selectedNodeId || edge.target === selectedNodeId))
          }
        />
      ))}
      {/* Draw nodes */}
      {nodes.map(node => (
        <NodeMesh
          key={node.id}
          node={node}
          selected={selectedNodeId === node.id}
          dragging={dragNodeId === node.id && dragging}
          onClick={(e) => handleNodeClick(node.id, e)}
          onPointerOver={(e) => { setHoverNode(node.id); }}
          onPointerOut={(e) => { setHoverNode(null); }}
        />
      ))}
    </Canvas>
  );
};
