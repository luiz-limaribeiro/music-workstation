export type StepData = {
  id: number;
  active: boolean;
  velocity: number;
  repeatValue: number;
  index: number;
}

let nextId = 1

export function newStepData(index: number): StepData {
  return {
    id: nextId++,
    active: false,
    velocity: 1.0,
    repeatValue: 1,
    index
  }
}