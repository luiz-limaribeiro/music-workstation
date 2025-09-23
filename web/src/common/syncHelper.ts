export function stepsToToneTime(steps: number) {
  const bars = Math.floor(steps / 16);
  const beats = Math.floor((steps % 16) / 4);
  const sixteenths = steps % 4;
  return `${bars}:${beats}:${sixteenths}`;
}

export function toneTimeToSteps(toneTime: string) {
  const [bars, beats, sixteenths] = toneTime.toString().split(":");
  return Number(bars) * 16 + Number(beats) * 4 + Number(sixteenths);
}
