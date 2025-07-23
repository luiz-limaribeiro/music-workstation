export type Step = {
  active: boolean;
  velocity: number;
}

export function newStep(): Step {
  return {
    active: false,
    velocity: 1.0
  }
}