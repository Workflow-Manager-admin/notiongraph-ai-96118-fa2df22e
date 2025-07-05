"use client";
import React, { useEffect, useState } from "react";
import { getFolders, createFolder, renameFolder, deleteFolder, Folder } from "@/lib/indexeddb";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog } from "../ui/dialog";

// Type for external use (import/export)
export interface FolderSidebarProps {
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
}

export const FolderSidebar: React.FC<FolderSidebarProps> = ({
  selectedFolderId,
  setSelectedFolderId,
}) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    const fetchFolders = async () => {
      const fs = await getFolders(null);
      setFolders(fs);
    };
    fetchFolders();
  }, []);

  const refreshFolders = async () => {
    setFolders(await getFolders(null));
  };

  const handleAddFolder = async () => {
    if (newName.trim()) {
      await createFolder(newName.trim());
      setNewName("");
      setAdding(false);
      refreshFolders();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this folder and move its notes to root?")) {
      await deleteFolder(id);
      refreshFolders();
      if (selectedFolderId === id) setSelectedFolderId(null);
    }
  };
  const handleRename = async () => {
    if (renameId && renameValue.trim()) {
      await renameFolder(renameId, renameValue.trim());
      setRenameId(null);
      setRenameValue("");
      refreshFolders();
    }
  };

  return (
    <div className="flex flex-col border-r h-full min-w-[180px] p-2 bg-background/60">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-lg">Local Folders</span>
        <Button size="sm" onClick={() => setAdding(true)}>+</Button>
      </div>
      <ul className="flex-1 overflow-y-auto">
        <li
          className={`cursor-pointer rounded px-2 py-1 mb-1 ${selectedFolderId === null ? "bg-accent" : "hover:bg-muted"}`}
          onClick={() => setSelectedFolderId(null)}
        >
          <span>📄 No Folder</span>
        </li>
        {folders.map(folder => (
          <li
            key={folder.id}
            className={`flex items-center group mb-1 rounded px-2 py-1 ${
              selectedFolderId === folder.id ? "bg-accent" : "hover:bg-muted"
            }`}
          >
            <span
              onClick={() => setSelectedFolderId(folder.id)}
              className="flex-1 cursor-pointer truncate"
              title={folder.name}
            >
              📁 {folder.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-60 group-hover:opacity-100"
              onClick={() => {
                setRenameId(folder.id);
                setRenameValue(folder.name);
              }}
            >✏️</Button>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-60 group-hover:opacity-100"
              onClick={() => handleDelete(folder.id)}
            >🗑️</Button>
          </li>
        ))}
      </ul>
      <Dialog open={adding} onOpenChange={setAdding}>
        <div className="p-4 bg-white rounded shadow w-64 max-w-full">
          <div>Add new folder:</div>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Folder name"
            className="my-2"
          />
          <div className="flex gap-3">
            <Button onClick={handleAddFolder}>Create</Button>
            <Button variant="secondary" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
      <Dialog open={!!renameId} onOpenChange={open => !open && setRenameId(null)}>
        <div className="p-4 bg-white rounded shadow w-64 max-w-full">
          <div>Rename folder:</div>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            className="my-2"
            autoFocus
          />
          <div className="flex gap-3">
            <Button onClick={handleRename}>Save</Button>
            <Button variant="secondary" onClick={() => setRenameId(null)}>
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};
