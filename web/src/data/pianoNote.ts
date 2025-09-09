export type PianoNote = {
  id: number;
  start: number;
  length: number;
  keyId: number;
}

let nextId = 0;

export function newPianoNote(start: number, length: number, keyId: number) {
  return {
    id: ++nextId,
    start,
    length,
    keyId
  }
}