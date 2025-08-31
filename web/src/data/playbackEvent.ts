
export interface PlaybackEvent {
  time: number | string;
  player: (time: number, repeatValue: number) => void;
}
