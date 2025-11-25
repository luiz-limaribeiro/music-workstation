export function stepsToToneTime(steps: number): string {
  const bars = Math.floor(steps / 16);
  const beats = Math.floor((steps % 16) / 4);
  const sixteenths = steps % 4;
  return `${bars}:${beats}:${sixteenths}`;
}

export function stepsToSeconds(steps: number, bpm: number): number {
  const beats = steps / 4
  return (60 / bpm) * beats
}

export function toneTimeToSteps(toneTime: string): number {
  const [bars, beats, sixteenths] = toneTime.toString().split(":");
  return Number(bars) * 16 + Number(beats) * 4 + Number(sixteenths);
}
