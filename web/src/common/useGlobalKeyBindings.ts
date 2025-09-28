import { useEffect } from "react";
import { dawHistory } from "./historyManager";
import { updateTimelineLength } from "./timelineLength";
import { buildPlayback } from "../features/piano-roll/playback";
import { DuplicateSelectedNotesCommand, RemoveSelectedNotesCommand } from "./command";
import usePianoRollStore from "../store/pianoRollStore";

export const useGlobalKeyBindings = () => {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const isUndo =
        (e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z");
      const isRedo =
        (e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y");
      const isDuplicate =
        (e.ctrlKey || e.metaKey) && (e.key === "d" || e.key === "D");
      const isDelete = e.key === "Delete"
      const isSave =
        (e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S");


      if (isUndo) {
        e.preventDefault();
        dawHistory.undo();
        updateTimelineLength()
        buildPlayback()
      } else if (isRedo) {
        e.preventDefault();
        dawHistory.redo();
        updateTimelineLength()
        buildPlayback()
      } else if (isDelete) {
        const command = new RemoveSelectedNotesCommand()
        dawHistory.doCommand(command)
      } else if (isDuplicate) {
        e.preventDefault()
        const command = new DuplicateSelectedNotesCommand()
        dawHistory.doCommand(command)
      }
      else if (isSave) {
        e.preventDefault()
        usePianoRollStore.getState().pianoRollActions.saveStateToDB()
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};
