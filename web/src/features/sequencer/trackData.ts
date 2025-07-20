export type TrackData = {
  id: number;
  name: string;
  velocity: number;
  pattern: number[];
  play: (time: number, velocity: number) => void;
};