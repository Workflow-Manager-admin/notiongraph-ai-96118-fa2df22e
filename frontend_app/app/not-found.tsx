"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
  const quotes = [
    `"Yes, I am a criminal. My crime is that of curiosity." – The Hacker’s Manifesto`,
    `"Maybe this page was a ghost node with no backlinks." – Athera`,
    `"This page is 404… like your TODOs."`,
    `"You’ve fallen into the void between thoughts. Mind the gap."`,
    `"Some notes just want to watch the world burn."`,
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="h-full flex flex-col items-center justify-center text-center space-y-5 px-6">
      <Image
        src="/error.png"
        height={280}
        width={280}
        alt="Lost note"
        className="dark:hidden"
        priority
      />
      <Image
        src="/error-dark.png"
        height={280}
        width={280}
        alt="404 in the shadows"
        className="hidden dark:block"
        priority
      />

      <h2 className="text-2xl font-bold tracking-tight">
        🧠 Oops! That note slipped through the graph.
      </h2>

      <p className="text-muted-foreground max-w-md">
        The note you're looking for isn't here. Maybe it was deleted, renamed, or never existed at all. Happens to the best of us.
      </p>

      <Button asChild className="mt-2">
        <Link href="/">🔙 Back to homebase</Link>
      </Button>

      <div className="mt-6 text-sm text-muted-foreground italic">
        <span>💡 {randomQuote}</span>
      </div>
    </div>
  );
}
