"use client";
import React, { useEffect, useRef, useState } from "react";
import { getNoteById, updateNote, Note } from "@/lib/indexeddb";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";

interface LocalNoteEditorProps {
  noteId: string | null;
  onNoteEdit?: (note?: Note) => void;
}

// Use a dynamic import for the Blocknote/Editor to avoid SSR issues.
const BlocknoteEditor = dynamic(() => import("../editor"), { ssr: false });

export const LocalNoteEditor: React.FC<LocalNoteEditorProps> = ({
  noteId,
  onNoteEdit,
}) => {
  const [note, setNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!noteId) {
      setNote(null);
      setTitle("");
      setContent("");
      return;
    }
    getNoteById(noteId).then((n) => {
      if (n) {
        setNote(n);
        setTitle(n.title);
        setContent(n.content);
        onNoteEdit?.(n);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    triggerSave(val, content);
  };
  const handleContentChange = (val: string) => {
    setContent(val);
    triggerSave(title, val);
  };
  // Debounce save
  const triggerSave = (newTitle: string, newContent: string) => {
    if (!noteId) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaving(true);
      await updateNote(noteId, { title: newTitle, content: newContent });
      setSaving(false);
    }, 500);
  };

  if (!noteId) {
    return (
      <div className="flex-1 text-muted-foreground flex items-center justify-center">
        Select or create a note
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 h-full w-full px-6 py-6">
      <Input
        value={title}
        onChange={e => handleTitleChange(e.target.value)}
        placeholder="Title"
        className="text-xl font-bold mb-1"
      />
      <div className="flex-1 min-h-[320px] max-h-[calc(100vh-200px)]">
        <BlocknoteEditor
          initialContent={content}
          onChange={handleContentChange}
          placeholder="Write your note here..."
          // Forward any extra props if your Blocknote editor needs
        />
      </div>
      <div className="flex items-center text-xs text-muted-foreground">
        {saving ? "Saving..." : "Changes saved locally"}
      </div>
    </div>
  );
};
