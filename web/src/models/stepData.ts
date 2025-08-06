export type StepData = {
  active: boolean;
  velocity: number;
  repeatValue: number;
}

export function newStepData(): StepData {
  return {
    active: false,
    velocity: 1.0,
    repeatValue: 1
  }
}