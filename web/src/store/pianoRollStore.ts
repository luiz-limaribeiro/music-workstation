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
  playbackClock: string;
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
    removeSelected: () => PianoNote[];
    selectNote: (noteId: number) => void;
    unselectNote: (noteId: number) => void;
    resetSelected: () => void;
    duplicateSelected: () => PianoNote[];
    updateCellDimensions: (width: number, height: number) => void;
    setRecentNoteLength: (length: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setPlaybackClock: (time: string) => void;
    setBpm: (bpm: number) => void;
    setSelectedNotes: (ids: Set<number>) => void;
  };
};

const usePianoRollStore = create<PianoRollStore>((set, get) => ({
  highlightedKeys: [],
  notes: { byId: {}, allIds: [] },
  length: 16,
  cellWidth: 38,
  cellHeight: 28,
  selectedNotes: new Set<number>(),
  recentNoteLength: 4,
  isPlaying: false,
  playbackClock: "00:00:00",
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
    removeSelected: () => {
      const state = get();
      const allNotes = state.notes.byId;
      const selectedIds = state.selectedNotes;
      const removedNotes: PianoNote[] = [];

      selectedIds.forEach((id) => {
        if (allNotes[id]) {
          removedNotes.push(allNotes[id]);
        }
      });

      set((state) => {
        const newById = { ...state.notes.byId };
        const newAllIds = [...state.notes.allIds];

        selectedIds.forEach((id) => {
          delete newById[id];

          const index = newAllIds.indexOf(id);
          if (index > -1) newAllIds.splice(index, 1);
        });

        return {
          notes: {
            byId: newById,
            allIds: newAllIds,
          },
          selectedNotes: new Set(),
        };
      });

      return removedNotes;
    },
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
    unselectNote: (noteId) =>
      set((state) => {
        const selected = new Set<number>();
        selected.clear();

        state.selectedNotes.forEach((id) => {
          if (id !== noteId) selected.add(id);
        });

        return { selectedNotes: selected };
      }),
    resetSelected: () => set({ selectedNotes: new Set<number>() }),
    duplicateSelected: () => {
      const state = get();
      const newNotes: PianoNote[] = [];
      const newSelectedIds = new Set<number>();

      state.selectedNotes.forEach((id) => {
        const note = state.notes.byId[id];
        if (!note) return;
        const newNote = newPianoNote(note.start + 1, note.length, note.keyId);
        newNotes.push(newNote);
        newSelectedIds.add(newNote.id);
      });

      set((state) => {
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
      })
      
      return newNotes
    },
    updateCellDimensions: (width, height) =>
      set({
        cellWidth: Math.max(18, Math.min(width, 38)),
        cellHeight: Math.max(18, Math.min(height, 28)),
      }),
    setRecentNoteLength: (length) => set({ recentNoteLength: length }),
    setIsPlaying: (isPlaying) => set({ isPlaying: isPlaying }),
    setPlaybackClock: (time) => set({ playbackClock: time }),
    setBpm: (bpm) => set({ bpm: bpm }),
    setSelectedNotes: (ids) => set({ selectedNotes: ids }),
  },
}));

export default usePianoRollStore;
