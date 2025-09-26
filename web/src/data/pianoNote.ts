import usePianoRollStore from "../store/pianoRollStore";

export type PianoNote = {
  id: number;
  start: number;
  length: number;
  keyId: number;
};

export function newPianoNote(start: number, length: number, keyId: number) {
  const nextId = usePianoRollStore.getState().nextNoteId
  usePianoRollStore.getState().pianoRollActions.incrementNoteId()

  return {
    id: nextId,
    start,
    length,
    keyId,
  };
}
