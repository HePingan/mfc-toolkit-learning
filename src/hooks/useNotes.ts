import { useLocalStorage } from './useLocalStorage';
import { storageKeys } from '../data/storageKeys';

export type StudyNote = {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = storageKeys.notes;

function makeId() {
  return `note-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function normalizeTags(input: string | string[]) {
  const values = Array.isArray(input) ? input : input.split(/[，,\s]+/);
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean))).slice(0, 8);
}

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<StudyNote[]>(STORAGE_KEY, []);

  const addNote = (payload: { moduleId: string; title: string; content: string; tags: string | string[] }) => {
    const now = new Date().toISOString();
    const note: StudyNote = {
      id: makeId(),
      moduleId: payload.moduleId,
      title: payload.title.trim() || '未命名笔记',
      content: payload.content.trim(),
      tags: normalizeTags(payload.tags),
      createdAt: now,
      updatedAt: now,
    };
    setNotes([note, ...notes]);
    return note;
  };

  const updateNote = (id: string, patch: Partial<Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt' | 'tags'>> & { tags?: string | string[] }) => {
    setNotes(notes.map((note) => note.id === id ? {
      ...note,
      ...patch,
      title: patch.title !== undefined ? patch.title.trim() || '未命名笔记' : note.title,
      content: patch.content !== undefined ? patch.content.trim() : note.content,
      tags: patch.tags !== undefined ? normalizeTags(patch.tags) : note.tags,
      updatedAt: new Date().toISOString(),
    } : note));
  };

  const removeNote = (id: string) => setNotes(notes.filter((note) => note.id !== id));
  const clearNotes = () => setNotes([]);
  const importNotes = (next: StudyNote[]) => {
    const normalized = next.filter((note) => note && note.id && note.title).map((note) => ({
      ...note,
      tags: normalizeTags(note.tags ?? []),
      createdAt: note.createdAt || new Date().toISOString(),
      updatedAt: note.updatedAt || note.createdAt || new Date().toISOString(),
    }));
    setNotes(normalized);
  };

  return { notes, addNote, updateNote, removeNote, clearNotes, importNotes };
}
