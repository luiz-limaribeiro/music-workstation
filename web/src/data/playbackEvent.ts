
export interface PlaybackEvent {
  time: number | string;
  player: (time: number, velocity: number, repeatValue: number) => void;
  velocity: number;
}
