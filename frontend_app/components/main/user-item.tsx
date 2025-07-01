"use client";

import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsLeftRight, LogOut, Home } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export const UserItem = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex items-center gap-2 p-3">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  const fullName = user.fullName || user.firstName || "User";
  const email = user.emailAddresses[0]?.emailAddress || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex items-center justify-between px-3 py-2 w-full hover:bg-accent/40 transition rounded-md group"
        >
          <div className="flex items-center gap-3 max-w-[180px] overflow-hidden">
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.imageUrl} />
              <AvatarFallback>{fullName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-medium truncate">
                {fullName}
              </span>
              <span className="text-[11px] text-muted-foreground truncate">
                {email}
              </span>
            </div>
          </div>
          <ChevronsLeftRight className="rotate-90 text-muted-foreground h-4 w-4 group-hover:text-primary transition" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-72 shadow-xl"
        align="start"
        alignOffset={10}
        forceMount
      >
        <div className="px-4 py-3 border-b border-border space-y-1">
          <p className="text-sm font-medium text-foreground leading-tight">
            {fullName}
          </p>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>

        {/* Redirects to Home Page ("/") */}
        <DropdownMenuItem asChild>
          <Link href="/">
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-sm text-red-600 hover:bg-destructive/10 cursor-pointer"
          asChild
        >
          <SignOutButton>
            <div className="flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </div>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
