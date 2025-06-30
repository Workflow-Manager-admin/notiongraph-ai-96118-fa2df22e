"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react"; // 👈 updated icon for system
import { cn } from "@/lib/utils";

const iconMap: Record<string, JSX.Element> = {
  light: <Sun className="h-5 w-5" />,
  dark: <Moon className="h-5 w-5" />,
  system: <Monitor className="h-5 w-5" />, // 👈 system icon is now a monitor
};

const nextTheme: Record<string, string> = {
  light: "dark",
  dark: "system",
  system: "light",
};

export const ModeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const currentTheme = theme === "system" ? "system" : theme || "system";
  const displayTheme = theme === "system" ? resolvedTheme : theme;
  const next = nextTheme[currentTheme];

  return (
    <button
      onClick={() => setTheme(next)}
      className={cn(
        "w-10 h-10 rounded-full border border-border flex items-center justify-center",
        "transition-all duration-500 hover:rotate-180 hover:scale-105",
        "bg-background shadow-lg hover:shadow-[0_0_10px_#00FFF066]"
      )}
      aria-label="Cycle theme"
      title={`Switch to ${next} mode`}
    >
      <span className="transition-transform duration-500">
        {iconMap[theme || "system"]}
      </span>
    </button>
  );
};
