"use client";
import React, { useEffect, useState } from "react";
import { getNotesInFolder, createNote, deleteNote, Note } from "@/lib/indexeddb";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface LocalNoteListProps {
  folderId: string | null;
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;
}

export const LocalNoteList: React.FC<LocalNoteListProps> = ({
  folderId,
  selectedNoteId,
  setSelectedNoteId,
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    refreshNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folderId]);

  const refreshNotes = async () => {
    setNotes(await getNotesInFolder(folderId));
  };

  const handleAddNote = async () => {
    if (title.trim()) {
      const note = await createNote(title.trim(), "", folderId);
      setTitle("");
      setAdding(false);
      await refreshNotes();
      setSelectedNoteId(note.id);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this note?")) {
      await deleteNote(id);
      refreshNotes();
      if (selectedNoteId === id) setSelectedNoteId(null);
    }
  };

  return (
    <div className="flex flex-col border-r min-w-[180px] p-2 bg-background/50">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-md">Local Notes</span>
        <Button size="sm" onClick={() => setAdding(true)}>+</Button>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {notes.length === 0 && (
          <li className="text-muted-foreground italic">No notes</li>
        )}
        {notes.map(note => (
          <li
            key={note.id}
            className={`flex items-center group rounded px-2 py-1 mb-1 ${
              selectedNoteId === note.id ? "bg-accent" : "hover:bg-muted"
            }`}
          >
            <span
              className="flex-1 cursor-pointer truncate"
              title={note.title}
              onClick={() => setSelectedNoteId(note.id)}
            >
              📝 {note.title || "Untitled"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-60 group-hover:opacity-100"
              onClick={() => handleDelete(note.id)}
            >🗑️</Button>
          </li>
        ))}
      </ul>
      {adding && (
        <div className="bg-white p-3 rounded shadow flex-col flex gap-2 mt-2 z-20">
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
            placeholder="Note title"
          />
          <div className="flex gap-2">
            <Button onClick={handleAddNote}>Create</Button>
            <Button variant="secondary" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
