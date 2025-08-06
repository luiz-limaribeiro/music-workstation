export type ClipData = {
  id: number;
  startStep: number; // 0 for bar 1, 16 for bar 2
  length: number; // in steps
};

let nextId = 0;

export function newClipData(startStep: number, length: number): ClipData {
  return {
    id: nextId++,
    startStep,
    length,
  };
}
