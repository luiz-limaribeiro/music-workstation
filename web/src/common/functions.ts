import { buildPlayback } from "../playback";
import { history } from "./historyManager";
import { updateTimelineLength } from "./timelineLength";

export function undo() {
  history.undo();
  updateTimelineLength();
  buildPlayback();
}

export function redo() {
  history.redo();
  updateTimelineLength();
  buildPlayback();
}
