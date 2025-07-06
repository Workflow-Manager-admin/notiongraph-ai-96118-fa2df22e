import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  createdAt: number;
  updatedAt: number;
}

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: number;
}

interface NotesDB extends DBSchema {
  notes: {
    key: string;
    value: Note;
    indexes: {
      folderId: string;
      updatedAt: number;
    };
  };
  folders: {
    key: string;
    value: Folder;
    // Indexes must **exclude `null`**—so we declare them as `string`, and handle nulls at runtime
    indexes: {
      parentId: string;
      name: string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<NotesDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<NotesDB>('local-notes-db', 1, {
      upgrade(db) {
        const noteStore = db.createObjectStore('notes', { keyPath: 'id' });
        noteStore.createIndex('folderId', 'folderId');
        noteStore.createIndex('updatedAt', 'updatedAt');

        const folderStore = db.createObjectStore('folders', { keyPath: 'id' });
        folderStore.createIndex('parentId', 'parentId');
        folderStore.createIndex('name', 'name');
      },
    });
  }
  return dbPromise;
}

// --- FOLDER OPERATIONS ---

export async function createFolder(name: string, parentId: string | null = null): Promise<Folder> {
  const db = await getDB();
  const id = crypto.randomUUID();
  const folder: Folder = {
    id,
    name,
    parentId,
    createdAt: Date.now(),
  };
  await db.add('folders', folder);
  return folder;
}

export async function renameFolder(folderId: string, newName: string): Promise<void> {
  const db = await getDB();
  const folder = await db.get('folders', folderId);
  if (!folder) throw new Error('Folder not found');
  folder.name = newName;
  await db.put('folders', folder);
}

export async function deleteFolder(folderId: string): Promise<void> {
  const db = await getDB();
  const notes = await db.getAllFromIndex('notes', 'folderId', folderId);
  for (const note of notes) {
    note.folderId = null;
    await db.put('notes', note);
  }

  const subfolders = (await db.getAll('folders')).filter(f => f.parentId === folderId);
  for (const sub of subfolders) {
    await deleteFolder(sub.id);
  }

  await db.delete('folders', folderId);
}

export async function getFolders(parentId: string | null = null): Promise<Folder[]> {
  const db = await getDB();
  const all = await db.getAll('folders');
  return all.filter(f => f.parentId === parentId);
}

export async function getFolderById(folderId: string): Promise<Folder | undefined> {
  const db = await getDB();
  return db.get('folders', folderId);
}

// --- NOTE OPERATIONS ---

export async function createNote(title: string, content: string, folderId: string | null = null): Promise<Note> {
  const db = await getDB();
  const id = crypto.randomUUID();
  const now = Date.now();
  const note: Note = {
    id,
    title,
    content,
    folderId,
    createdAt: now,
    updatedAt: now,
  };
  await db.add('notes', note);
  return note;
}

export async function updateNote(noteId: string, data: Partial<Omit<Note, 'id' | 'createdAt'>>): Promise<void> {
  const db = await getDB();
  const note = await db.get('notes', noteId);
  if (!note) throw new Error('Note not found');
  Object.assign(note, data);
  note.updatedAt = Date.now();
  await db.put('notes', note);
}

export async function deleteNote(noteId: string): Promise<void> {
  const db = await getDB();
  await db.delete('notes', noteId);
}

export async function getNotesInFolder(folderId: string | null = null): Promise<Note[]> {
  const db = await getDB();
  if (folderId === null) {
    const all = await db.getAll('notes');
    return all.filter(n => n.folderId === null);
  } else {
    return await db.getAllFromIndex('notes', 'folderId', folderId);
  }
}

export async function getNoteById(noteId: string): Promise<Note | undefined> {
  const db = await getDB();
  return db.get('notes', noteId);
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await getDB();
  return await db.getAll('notes');
}

export type { Note, Folder };
