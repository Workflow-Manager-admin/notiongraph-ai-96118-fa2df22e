"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useConvexAuth } from "convex/react";
import { Spinner } from "@/components/spinner";
import { SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
        Write. Link. Think.
        <br />
        Welcome to{" "}
        <span
          className={cn(
            "relative inline-block text-blue-500 dark:text-blue-400 transition-colors",
            "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full",
            "after:bg-blue-500 dark:after:bg-blue-400 after:scale-x-0 after:origin-left",
            "after:transition-transform after:duration-300 hover:after:scale-x-100"
          )}
        >
          Aethra
        </span>
      </h1>

      <h3 className="text-base sm:text-xl md:text-2xl font-medium text-muted-foreground">
        Aethra is your second brain — a powerful note system to organize thoughts,  
        discover connections, and think clearly with AI by your side.
      </h3>

      {isLoading && (
        <div className="w-full flex items-center justify-center pt-2">
          <Spinner size="lg" />
        </div>
      )}

      {!isAuthenticated && !isLoading && (
        <SignUpButton mode="modal">
          <Button
            size="sm"
            className="mt-2 text-base px-5 py-3 bg-blue-600 text-white hover:bg-blue-500 transition-colors"
          >
            Get Aethra Free <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </SignUpButton>
      )}

      {isAuthenticated && !isLoading && (
        <Button
          asChild
          size="sm"
          className="mt-2 text-base px-5 py-3 bg-white text-black hover:bg-neutral-200 transition-colors dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
        >
          <Link href="/documents">
            Enter Aethra <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      )}
    </div>
  );
};
