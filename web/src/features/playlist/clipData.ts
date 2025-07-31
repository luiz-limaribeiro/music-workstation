import type { Step } from "../sequencer/step"

export type ClipData = {
  id: number
  trackId: number
  startStep: number
  length: number
  pattern: Step[]
}