export type StepData = {
  id: number;
  active: boolean;
  velocity: number;
  repeatValue: number;
}

let nextId = 1

export function newStepData(): StepData {
  return {
    id: nextId++,
    active: false,
    velocity: 1.0,
    repeatValue: 1
  }
}