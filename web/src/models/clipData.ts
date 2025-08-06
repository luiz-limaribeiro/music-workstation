export type ClipData = {
  id: number;
  startStep: number; // 0 for bar 1, 16 for bar 2
  length: number; // in steps
  trackId: number;
};

let nextId = 0;

export function newClipData(trackId: number, startStep: number, length: number) {
  nextId += 1;

  return {
    id: nextId,
    startStep,
    length,
    trackId
  };
}
