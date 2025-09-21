import { create } from "zustand";
import { newPianoNote, type PianoNote } from "../data/pianoNote";

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
  playbackSeconds: number;
  bpm: number;
  pianoRollActions: {
    setHighlightedKeys: (keyIds: number[]) => void;
    setLength: (length: number) => void;
    highlightKey: (keyId: number) => void;
    resetKey: (keyId: number) => void;
    addNote: (note: PianoNote) => void;
    removeNote: (noteId: number) => void;
    updateNote: (
      noteId: number,
      updater: (note: PianoNote) => PianoNote
    ) => void;
    removeSelected: () => void;
    selectNote: (noteId: number) => void;
    resetSelected: () => void;
    duplicatedSelected: () => void;
    updateCellDimensions: (width: number, height: number) => void;
    setRecentNoteLength: (length: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setPlaybackTime: (time: string) => void;
    setPlaybackSeconds: (seconds: number) => void;
    setBpm: (bpm: number) => void;
  };
};

const usePianoRollStore = create<PianoRollStore>((set) => ({
  highlightedKeys: [],
  notes: { byId: {}, allIds: [] },
  length: 16,
  cellWidth: 38,
  cellHeight: 28,
  selectedNotes: new Set<number>(),
  recentNoteLength: 4,
  isPlaying: false,
  playbackTime: "00:00:00",
  playbackSeconds: 0,
  bpm: 120,
  pianoRollActions: {
    setHighlightedKeys: (keyIds) => set(() => ({ highlightedKeys: keyIds })),
    setLength: (length) => set({ length: length }),
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
    removeSelected: () =>
      set((state) => {
        let newAllIds = state.notes.allIds;

        for (const id of state.selectedNotes) {
          delete state.notes.byId[id];
          newAllIds = newAllIds.filter((i) => i !== id);
        }

        return {
          notes: {
            ...state.notes,
            allIds: newAllIds,
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
    duplicatedSelected: () =>
      set((state) => {
        const newNotes: PianoNote[] = [];
        const newSelectedIds = new Set<number>();

        state.selectedNotes.forEach((id) => {
          const note = state.notes.byId[id];
          const newNote = newPianoNote(note.start + 1, note.length, note.keyId);
          newNotes.push(newNote);
          newSelectedIds.add(newNote.id);
        });

        const newById = {
          ...state.notes.byId,
          ...Object.fromEntries(newNotes.map((note) => [note.id, note])),
        };

        const newAllIds = [
          ...state.notes.allIds,
          ...newNotes.map((note) => note.id),
        ];

        return {
          notes: {
            byId: newById,
            allIds: newAllIds,
          },
          selectedNotes: newSelectedIds,
        };
      }),
    updateCellDimensions: (width, height) =>
      set({
        cellWidth: Math.max(18, Math.min(width, 38)),
        cellHeight: Math.max(18, Math.min(height, 28)),
      }),
    setRecentNoteLength: (length) => set({ recentNoteLength: length }),
    setIsPlaying: (isPlaying) => set({ isPlaying: isPlaying }),
    setPlaybackTime: (time) => set({ playbackTime: time }),
    setPlaybackSeconds: (seconds) => set({ playbackSeconds: seconds }),
    setBpm: (bpm) => set({ bpm: bpm }),
  },
}));

export default usePianoRollStore;
