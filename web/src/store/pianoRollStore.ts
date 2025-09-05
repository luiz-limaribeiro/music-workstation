import { create } from "zustand";

export type PianoRollStore = {
  activeKeyIds: number[];
  pianoRollActions: {
    addKey: (keyId: number) => void;
    removeKey: (keyId: number) => void;
  };
};

const usePianoRollStore = create<PianoRollStore>((set) => ({
  activeKeyIds: [],
  pianoRollActions: {
    addKey: (keyId) => {
      set((state) => ({ activeKeyIds: [...state.activeKeyIds, keyId] }));
    },
    removeKey: (keyId) => {
      set((state) => ({
        activeKeyIds: [...state.activeKeyIds.filter((id) => id !== keyId)],
      }));
    },
  },
}));

export default usePianoRollStore;
