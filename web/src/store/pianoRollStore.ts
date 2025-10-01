import { create } from "zustand";
import { newPianoNote, type PianoNote } from "../data/pianoNote";
import {
  clearProjectMeta,
  loadPianoRollState,
  renameProject,
  savePianoRollState,
  saveProjectMeta,
} from "../data/pianoRollDB";

export type PianoRollStore = {
  highlightedKeys: number[];
  notes: { byId: { [id: number]: PianoNote }; allIds: number[] };
  loopLength: number;
  gridLength: number;
  stepWidth: number;
  stepHeight: number;
  selectedNotes: Set<number>;
  recentNoteLength: number;
  isPlaying: boolean;
  playbackClock: string;
  bpm: number;
  nextNoteId: number;
  activeProjectId: string | null;
  projectSaved: boolean;
  loadingWAV: boolean;
  pianoRollActions: {
    setHighlightedKeys: (keyIds: number[]) => void;
    setLoopLength: (length: number) => void;
    setGridLength: (length: number) => void;
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
    setActiveProjectId: (id: string) => void;
    saveProjectToDB: (projectId: string, name: string) => Promise<void>;
    deleteProjectInDB: (projectId: string) => Promise<void>;
    renameProject: (projectId: string, newName: string) => Promise<void>;
    saveStateToDB: () => Promise<void>;
    loadStateFromDB: (projectId: string) => Promise<void>;
    incrementNoteId: () => void;
    setLoadingWAV: (loading: boolean) => void;
  };
};

const defaultState = {
  highlightedKeys: [],
  notes: { byId: {}, allIds: [] },
  loopLength: 16,
  gridLength: 80,
  stepWidth: 38,
  stepHeight: 28,
  selectedNotes: new Set<number>(),
  recentNoteLength: 4,
  isPlaying: false,
  playbackClock: "00:00",
  bpm: 120,
  nextNoteId: 0,
  activeProjectId: null,
  projectSaved: true,
  loadingWAV: false,
};

const usePianoRollStore = create<PianoRollStore>((set, get) => ({
  ...defaultState,
  pianoRollActions: {
    setHighlightedKeys: (keyIds) => set(() => ({ highlightedKeys: keyIds })),
    setLoopLength: (length) => set({ loopLength: length }),
    setGridLength: (length) => set({ gridLength: length < 80 ? 80 : length }),
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
        projectSaved: false,
      })),
    removeNote: (noteId) =>
      set((state) => {
        delete state.notes.byId[noteId];

        return {
          notes: {
            ...state.notes,
            allIds: state.notes.allIds.filter((id) => id !== noteId),
          },
          projectSaved: false,
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
          projectSaved: false,
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
          projectSaved: false,
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
        const newNote = newPianoNote(note.start + 1, note.length, note.keyId, note.velocity);
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
          projectSaved: false,
        };
      });

      return newNotes;
    },
    updateCellDimensions: (width, height) =>
      set({
        stepWidth: Math.max(18, Math.min(width, 38)),
        stepHeight: Math.max(18, Math.min(height, 28)),
      }),
    setRecentNoteLength: (length) => set({ recentNoteLength: length }),
    setIsPlaying: (isPlaying) => set({ isPlaying: isPlaying }),
    setPlaybackClock: (time) => set({ playbackClock: time }),
    setBpm: (bpm) => set({ bpm: bpm, projectSaved: false }),
    setSelectedNotes: (ids) => set({ selectedNotes: ids }),
    setActiveProjectId: (id) => set({ activeProjectId: id }),
    saveProjectToDB: async (id, name) => {
      await saveProjectMeta(id, name);
      await savePianoRollState(id, {
        notes: { byId: {}, allIds: [] },
        loopLength: 16,
        gridLength: 80,
        bpm: 120,
        nextNoteId: 0,
        activeProjectId: id,
      });
      await loadPianoRollState(id);
    },
    deleteProjectInDB: async (id) => {
      const state = get();
      if (!state.activeProjectId) return;
      await clearProjectMeta(id);

      set({ activeProjectId: null });
    },
    renameProject: async (id, name) => {
      await renameProject(id, name);
    },
    saveStateToDB: async () => {
      const state = get();
      if (!state.activeProjectId) return;

      await savePianoRollState(state.activeProjectId, {
        notes: state.notes,
        loopLength: state.loopLength,
        gridLength: state.gridLength,
        bpm: state.bpm,
        nextNoteId: state.nextNoteId,
        activeProjectId: state.activeProjectId,
      });

      set({ projectSaved: true });
    },
    loadStateFromDB: async (projectId) => {
      const saved = await loadPianoRollState(projectId);
      if (saved) {
        set({
          ...saved,
          highlightedKeys: [],
          stepWidth: 38,
          stepHeight: 28,
          selectedNotes: new Set<number>(),
          recentNoteLength: 4,
          isPlaying: false,
          playbackClock: "00:00",
          activeProjectId: projectId,
        });
      } else {
        set({
          ...defaultState,
        });
      }
    },
    incrementNoteId: () => {
      const store = get();
      const nextId = (store.nextNoteId += 1);

      set({ nextNoteId: nextId });
    },
    setLoadingWAV: (loading) => set({ loadingWAV: loading }),
  },
}));

export default usePianoRollStore;
