import { create } from "zustand";
import type { PianoNote } from "../data/pianoNote";

export type PianoRollStore = {
  highlightedKeys: number[];
  notes: { byId: { [id: number]: PianoNote }; allIds: number[] };
  length: number;
  cellWidth: number;
  cellHeight: number;
  pianoRollActions: {
    setHighlightedKeys: (keyIds: number[]) => void;
    highlightKey: (keyId: number) => void;
    resetKey: (keyId: number) => void;
    addNote: (note: PianoNote) => void;
    updateNote: (
      noteId: number,
      updates: { startStep: number | null; length: number | null }
    ) => void;
  };
};

const usePianoRollStore = create<PianoRollStore>((set) => ({
  highlightedKeys: [],
  notes: { byId: {}, allIds: [] },
  length: 80,
  cellWidth: 48,
  cellHeight: 28,
  pianoRollActions: {
    setHighlightedKeys: (keyIds) => {
      set(() => ({ highlightedKeys: keyIds }));
    },
    highlightKey: (keyId) => {
      set((state) => ({ highlightedKeys: [...state.highlightedKeys, keyId] }));
    },
    resetKey: (keyId) => {
      set((state) => ({
        highlightedKeys: state.highlightedKeys.filter((id) => id !== keyId),
      }));
    },
    addNote: (note) => {
      set((state) => ({
        notes: {
          byId: { ...state.notes.byId, [note.id]: note },
          allIds: [...state.notes.allIds, note.id],
        },
      }));
    },
    updateNote: (noteId, updates) =>
      set((state) => {
        const updatedNote = {
          ...state.notes.byId[noteId],
          ...(updates.length !== null ? { length: updates.length } : {}),
          ...(updates.startStep !== null
            ? { startStep: updates.startStep }
            : {}),
        };

        return {
          notes: {
            ...state.notes,
            [noteId]: updatedNote,
          },
        };
      }),
  },
}));

export default usePianoRollStore;
