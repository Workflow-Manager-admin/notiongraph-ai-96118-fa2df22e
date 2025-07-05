"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ErrorPage() {
  const quotes = [
    `“Yes, I am a criminal. My crime is that of curiosity.” – The Hacker’s Manifesto`,
    `“Maybe this page was a ghost node with no backlinks.” – Athera`,
    `“This page is 404… like your TODOs.”`,
    `“You’ve fallen into the void between thoughts. Mind the gap.”`,
    `“Some notes just want to watch the world burn.”`,
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center space-y-6 px-6 py-12 animate-fade-in">
      {/* Light Mode Image */}
      <Image
        src="/error.png"
        height={260}
        width={260}
        alt="Lost note"
        className="dark:hidden drop-shadow-sm"
        priority
      />

      {/* Dark Mode Image */}
      <Image
        src="/error-dark.png"
        height={260}
        width={260}
        alt="404 in the shadows"
        className="hidden dark:block drop-shadow-sm"
        priority
      />

      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        🧠 Oops! That note slipped through the graph.
      </h1>

      <p className="text-muted-foreground max-w-md text-sm sm:text-base">
        The note you’re looking for isn’t here. It may have been deleted, renamed, or never existed at all. Even the best explorers get lost.
      </p>

      <Button asChild className="mt-3">
        <Link href="/">🔙 Return to Homebase</Link>
      </Button>

      <p className="mt-8 text-xs sm:text-sm text-muted-foreground italic max-w-xs animate-pulse-fast">
        💡 {randomQuote}
      </p>
    </div>
  );
}
