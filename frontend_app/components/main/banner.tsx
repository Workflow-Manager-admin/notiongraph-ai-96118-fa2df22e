"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import { AlertTriangle } from "lucide-react";

interface BannerProps {
  documentId: Id<"documents">;
}

export const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onRemove = () => {
    const promise = remove({ id: documentId });
    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note.",
    });
    router.push("/documents");
  };

  const onRestore = () => {
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
  };

  return (
    <div className="w-full bg-rose-600/90 border-b border-rose-400 text-white px-4 py-3 text-sm flex items-center justify-between shadow-inner animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center gap-x-3">
        <AlertTriangle className="h-5 w-5 text-white" />
        <span>This page is currently in the Trash.</span>
      </div>
      <div className="flex items-center gap-x-2">
        <Button
          size="sm"
          onClick={onRestore}
          variant="outline"
          className="border-white bg-transparent hover:bg-white/10 text-white hover:text-white px-3 h-8"
        >
          Restore
        </Button>
        <ConfirmModal onConfirm={onRemove}>
          <Button
            size="sm"
            variant="outline"
            className="border-white bg-transparent hover:bg-white/10 text-white hover:text-white px-3 h-8"
          >
            Delete forever
          </Button>
        </ConfirmModal>
      </div>
    </div>
  );
};
