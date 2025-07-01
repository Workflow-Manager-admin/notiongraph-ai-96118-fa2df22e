import { LucideProps } from "lucide-react";
import dynamic from "next/dynamic";

export const Icons = {
  // Graph-related icons
  network: dynamic(() => import("lucide-react").then(mod => mod.Network)),
  search: dynamic(() => import("lucide-react").then(mod => mod.Search)),
  list: dynamic(() => import("lucide-react").then(mod => mod.List)),
  clock: dynamic(() => import("lucide-react").then(mod => mod.Clock)),
  maximize: dynamic(() => import("lucide-react").then(mod => mod.Maximize)),
  minimize: dynamic(() => import("lucide-react").then(mod => mod.Minimize)),
  // center: dynamic(() => import("lucide-react").then(mod => mod.Center)), // Center does not exist in Lucide
  layers: dynamic(() => import("lucide-react").then(mod => mod.Layers)),
  circle: dynamic(() => import("lucide-react").then(mod => mod.Circle)),
  menu: dynamic(() => import("lucide-react").then(mod => mod.Menu)),
  x: dynamic(() => import("lucide-react").then(mod => mod.X)),
  plus: dynamic(() => import("lucide-react").then(mod => mod.Plus)),
  settings: dynamic(() => import("lucide-react").then(mod => mod.Settings)),
  help: dynamic(() => import("lucide-react").then(mod => mod.HelpCircle)),

  // Logo/wordmark if needed
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </svg>
  ),
};