import { useEffect } from "react";
import { dawHistory } from "./historyManager";
import { updateTimelineLength } from "./timelineLength";
import { buildPlayback } from "../playback";
import { DuplicateSelectedNotesCommand, RemoveSelectedNotesCommand } from "./command";

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
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};
