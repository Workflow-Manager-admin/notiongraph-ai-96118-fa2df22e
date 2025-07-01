"use client";

import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MenuIcon } from "lucide-react";
import { Title } from "@/components/main/title";
import { Banner } from "@/components/main/banner";
import { Menu } from "@/components/main/menu";
import { Publish } from "@/components/main/publish";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

export const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();
  const documentId = params.documentId as Id<"documents">;

  const document = useQuery(api.documents.getById, {
    documentId,
  });

  const isLoading = document === undefined;
  const isMissing = document === null;

  if (isMissing) return null;

  return (
    <>
      <nav className="bg-background dark:bg-[#1F1F1F] border-b border-muted px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground hover:text-primary transition"
            aria-label="Expand sidebar"
          />
        )}
        <div className="flex items-center justify-between w-full">
          {isLoading ? (
            <Title.Skeleton />
          ) : (
            <Title initialData={document} />
          )}

          <div className="flex items-center gap-x-2">
            {isLoading ? (
              <Menu.Skeleton />
            ) : (
              <>
                <Publish initialData={document} />
                <Menu documentId={document._id} />
              </>
            )}
          </div>
        </div>
      </nav>

      {!isLoading && document?.isArchived && (
        <Banner documentId={document._id} />
      )}
    </>
  );
};
