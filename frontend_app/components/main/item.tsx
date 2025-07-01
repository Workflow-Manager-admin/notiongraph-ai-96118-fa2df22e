"use client";

import {
  ChevronDown,
  ChevronRight,
  LucideIcon,
  MoreHorizontal,
  Plus,
  Trash,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";

interface ItemProps {
  id?: Id<"documents">;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  level?: number;
  onExpand?: () => void;
  isSearch?: boolean;
}

export const Item = ({
  id,
  label,
  icon: Icon,
  onClick,
  active,
  documentIcon,
  expanded,
  onExpand,
  isSearch,
  level = 0,
}: ItemProps) => {
  const { user } = useUser();
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpand?.();
  };

  const handleCreate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;
    const promise = create({ title: "Untitled", parentDocument: id }).then((newId) => {
      if (!expanded) onExpand?.();
      router.push(`/documents/${newId}`);
    });

    toast.promise(promise, {
      loading: "Creating note...",
      success: "Note created!",
      error: "Failed to create note.",
    });
  };

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;
    const promise = archive({ id }).then(() => {
      router.push("/documents");
    });

    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to move note.",
    });
  };

  const Chevron = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "group w-full flex items-center py-1.5 pr-3 text-sm font-medium text-muted-foreground hover:bg-primary/5 rounded transition",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          onClick={handleExpand}
          className="mr-1 rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
        >
          <Chevron className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {documentIcon ? (
        <div className="shrink-0 h-4 w-4 mr-2">{documentIcon}</div>
      ) : (
        <Icon className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
      )}

      <span className="truncate">{label}</span>

      {isSearch && (
        <kbd className="ml-auto inline-flex items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
          <span className="text-xs">CTRL</span> + K
        </kbd>
      )}

      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
              <div className="opacity-0 group-hover:opacity-100 p-1 rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-700">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="right" className="w-64">
              <DropdownMenuItem onClick={handleArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by: {user?.fullName || "Unknown"}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div
            onClick={handleCreate}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-sm hover:bg-neutral-200 dark:hover:bg-neutral-700"
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level = 0 }: { level?: number }) {
  return (
    <div
      className="flex items-center gap-x-2 py-[3px]"
      style={{ paddingLeft: level ? `${level * 12 + 25}px` : "12px" }}
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
};
