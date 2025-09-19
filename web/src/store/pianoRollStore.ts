import { create } from "zustand";
import type { PianoNote } from "../data/pianoNote";

export type PianoRollStore = {
  highlightedKeys: number[];
  notes: { byId: { [id: number]: PianoNote }; allIds: number[] };
  length: number;
  cellWidth: number;
  cellHeight: number;
  selectedNotes: Set<number>;
  recentNoteLength: number;
  isPlaying: boolean;
  playbackTime: string;
  pianoRollActions: {
    setHighlightedKeys: (keyIds: number[]) => void;
    highlightKey: (keyId: number) => void;
    resetKey: (keyId: number) => void;
    addNote: (note: PianoNote) => void;
    removeNote: (noteId: number) => void;
    updateNote: (
      noteId: number,
      updater: (note: PianoNote) => PianoNote
    ) => void;
    selectNote: (noteId: number) => void;
    resetSelected: () => void;
    updateCellDimensions: (width: number, height: number) => void;
    setRecentNoteLength: (length: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setPlaybackTime: (time: string) => void;
  };
};

const usePianoRollStore = create<PianoRollStore>((set) => ({
  highlightedKeys: [],
  notes: { byId: {}, allIds: [] },
  length: 80,
  cellWidth: 38,
  cellHeight: 28,
  selectedNotes: new Set<number>(),
  recentNoteLength: 4,
  isPlaying: false,
  playbackTime: '00:00:00',
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
      })),
    removeNote: (noteId) =>
      set((state) => {
        delete state.notes.byId[noteId];

        return {
          notes: {
            ...state.notes,
            allIds: state.notes.allIds.filter((id) => id !== noteId),
          },
        };
      }),
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
    selectNote: (noteId) =>
      set((state) => ({ selectedNotes: state.selectedNotes.add(noteId) })),
    resetSelected: () => set({ selectedNotes: new Set<number>() }),
    updateCellDimensions: (width, height) =>
      set({
        cellWidth: Math.max(18, Math.min(width, 38)),
        cellHeight: Math.max(18, Math.min(height, 28)),
      }),
    setRecentNoteLength: (length) => set({ recentNoteLength: length }),
    setIsPlaying: (isPlaying) => set({ isPlaying: isPlaying }),
    setPlaybackTime: (time) => set({ playbackTime: time })
  },
}));

export default usePianoRollStore;
