"use client";

import React, { useState } from "react";
import { FolderSidebar } from "@/components/main/FolderSidebar";
import { LocalNoteList } from "@/components/main/LocalNoteList";
import { LocalNoteEditor } from "@/components/main/LocalNoteEditor";

export default function LocalNotesPage() {
  // Folders and selection state
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  return (
    <div className="flex h-[calc(100vh-60px)]">
      <FolderSidebar
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={id => {
          setSelectedFolderId(id);
          setSelectedNoteId(null);
        }}
      />
      <LocalNoteList
        folderId={selectedFolderId}
        selectedNoteId={selectedNoteId}
        setSelectedNoteId={setSelectedNoteId}
      />
      <div className="flex-1 h-full">
        <LocalNoteEditor
          noteId={selectedNoteId}
          onNoteEdit={() => {}} // Optionally handle side updates
        />
      </div>
    </div>
  );
}
