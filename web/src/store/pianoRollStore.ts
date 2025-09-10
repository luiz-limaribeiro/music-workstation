import { create } from "zustand";
import type { PianoNote } from "../data/pianoNote";

export type PianoRollStore = {
  highlightedKeys: number[];
  notes: { byId: { [id: number]: PianoNote }; allIds: number[] };
  length: number;
  cellWidth: number;
  cellHeight: number;
  selectedNoteId: number;
  pianoRollActions: {
    setHighlightedKeys: (keyIds: number[]) => void;
    highlightKey: (keyId: number) => void;
    resetKey: (keyId: number) => void;
    addNote: (note: PianoNote) => void;
    updateNote: (
      noteId: number,
      updater: (note: PianoNote) => PianoNote
    ) => void;
    selectNote: (noteId: number) => void;
  };
};

const usePianoRollStore = create<PianoRollStore>((set) => ({
  highlightedKeys: [],
  notes: { byId: {}, allIds: [] },
  length: 80,
  cellWidth: 48,
  cellHeight: 28,
  selectedNoteId: -1,
  pianoRollActions: {
    setHighlightedKeys: (keyIds) => set(() => ({ highlightedKeys: keyIds })),
    highlightKey: (keyId) =>
      set((state) => ({ highlightedKeys: [...state.highlightedKeys, keyId] })),
    resetKey: (keyId) =>
      set((state) => ({
        highlightedKeys: state.highlightedKeys.filter((id) => id !== keyId),
      })),
    addNote: (note) =>
      set((state) => ({
        notes: {
          byId: { ...state.notes.byId, [note.id]: note },
          allIds: [...state.notes.allIds, note.id],
        },
        selectedNoteId: note.id,
      })),
    updateNote: (noteId, updater) =>
      set((state) => {
        const prevNote = state.notes.byId[noteId];
        const updatedNote = updater(prevNote);

        return {
          notes: {
            ...state.notes,
            byId: {
              ...state.notes.byId,
              [noteId]: updatedNote,
            },
          },
        };
      }),
    selectNote: (noteId) => set({ selectedNoteId: noteId }),
  },
}));

export default usePianoRollStore;
