export function stepsToToneTime(steps: number) {
  const bars = Math.floor(steps / 16);
  const beats = Math.floor((steps % 16) / 4);
  const sixteenths = steps % 4;
  return `${bars}:${beats}:${sixteenths}`;
}