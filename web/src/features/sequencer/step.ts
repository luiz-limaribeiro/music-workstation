export type Step = {
  active: boolean;
  velocity: number;
  repeatValue: number;
}

export function newStep(): Step {
  return {
    active: false,
    velocity: 1.0,
    repeatValue: 1
  }
}