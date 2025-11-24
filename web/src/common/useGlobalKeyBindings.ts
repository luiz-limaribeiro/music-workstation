import { useEffect } from "react";
import { history } from "./historyManager";
import { DuplicateSelectedNotesCommand, RemoveSelectedNotesCommand } from "./command";
import { redo, undo } from "./functions";

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
        undo()
      } else if (isRedo) {
        e.preventDefault();
        redo()
      } else if (isDelete) {
        const command = new RemoveSelectedNotesCommand()
        history.doCommand(command)
      } else if (isDuplicate) {
        e.preventDefault()
        const command = new DuplicateSelectedNotesCommand()
        history.doCommand(command)
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};
