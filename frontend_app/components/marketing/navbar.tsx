"use client";

import { UseScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/marketing/logo";
import { ModeToggle } from "@/components/mode-toggle";
import { useConvexAuth } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = UseScrollTop();

  return (
    <header
      className={cn(
        "z-50 fixed top-0 w-full px-6 transition-all duration-500 ease-in-out backdrop-blur-xl",
        scrolled
          ? "h-16 bg-background/95 dark:bg-[#1F1F1F]/95 border-b border-border shadow-md"
          : "h-20 bg-background/90 dark:bg-[#1F1F1F]/90"
      )}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        {/* Left: Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className={cn(
              "transition-all duration-300",
              scrolled ? "h-8 w-8" : "h-10 w-10"
            )}
          >
            <Logo />
          </div>
          <span
            className={cn(
              "font-semibold tracking-tight transition-all duration-300",
              scrolled ? "text-xl" : "text-2xl",
              "bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent",
              "group-hover:from-blue-400 group-hover:to-cyan-300"
            )}
          >
            Aethra
          </span>
        </Link>

        {/* Right: Auth, Theme, Actions */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          {isLoading ? (
            <Spinner size="md" className="ml-2" />
          ) : !isAuthenticated ? (
            <>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-4 transition-all hover:bg-accent/40 hover:text-blue-600 dark:hover:bg-white/5 dark:hover:text-cyan-400"
                >
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  size="sm"
                  className="px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md hover:from-blue-700 hover:to-cyan-600 transition-all"
                >
                  Get started
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="ml-1 h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </SignUpButton>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="px-4 text-foreground/90 hover:text-blue-600 dark:hover:text-cyan-400 transition-all"
              >
                <Link href="/documents">
                  Dashboard
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    className="ml-1 h-4 w-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </Button>
              <div className="ml-1">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                      userButtonPopoverCard: "shadow-lg",
                    },
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
