export type PianoKey = {
  id: number;
  note: string;
  octave: number;
};

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const octaves = 9; // 0-8
let id = 0

export const pianoKeys: PianoKey[] = [
  ...Array.from({ length: octaves }, (_, octave) =>
    notes.map((note) => ({ id: ++id, note, octave }))
  ).flat().reverse(),
];
