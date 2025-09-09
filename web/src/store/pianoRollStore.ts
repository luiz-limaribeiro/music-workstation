import { create } from "zustand";

export type PianoRollStore = {
  highlightedKeys: number[];
  length: number;
  cellWidth: number;
  cellHeight: number;
  pianoRollActions: {
    setHighlightedKeys: (keyIds: number[]) => void
    highlightKey: (keyId: number) => void;
  };
};

const usePianoRollStore = create<PianoRollStore>((set) => ({
  highlightedKeys: [],
  length: 80,
  cellWidth: 48,
  cellHeight: 28,
  pianoRollActions: {
    setHighlightedKeys: (keyIds) => {
      set(() => ({ highlightedKeys: keyIds }))
    },
    highlightKey: (keyId) => {
      set((state) => ({ highlightedKeys: [...state.highlightedKeys, keyId] }));
    },
  },
}));

export default usePianoRollStore;
