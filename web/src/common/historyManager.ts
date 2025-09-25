import type { StoreApi } from "zustand";
import type { Command } from "./command";
import type { PianoRollStore } from "../store/pianoRollStore";
import usePianoRollStore from "../store/pianoRollStore";

export class HistoryManager {
  private store: StoreApi<PianoRollStore>;
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  constructor(storeApi: StoreApi<PianoRollStore>) {
    this.store = storeApi
  }

  doCommand(command: Command) {
    command.do(this.store.getState());
    this.undoStack.push(command);
    this.redoStack = [];
  }

  undo() {
    const command = this.undoStack.pop();
    if (command) {
      command.undo(this.store.getState());
      this.redoStack.push(command);
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      command.do(this.store.getState());
      this.undoStack.push(command);
    }
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}

export const dawHistory = new HistoryManager(usePianoRollStore)