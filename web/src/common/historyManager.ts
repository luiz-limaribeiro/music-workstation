import type { StoreApi } from "zustand";
import type { Command } from "./command";
import type { PianoRollStore } from "../store/pianoRollStore";
import usePianoRollStore from "../store/pianoRollStore";

export class HistoryManager {
  private store: StoreApi<PianoRollStore>;
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];
  private maxSize: number;

  constructor(storeApi: StoreApi<PianoRollStore>, maxSize = 200) {
    this.store = storeApi;
    this.maxSize = maxSize;
  }

  private updateStoreFlags() {
    this.store.setState({
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    });
  }

  doCommand(command: Command) {
    command.do(this.store.getState());
    this.undoStack.push(command);
    this.redoStack = [];

    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }

    this.updateStoreFlags();
  }

  undo() {
    const command = this.undoStack.pop();
    if (command) {
      command.undo(this.store.getState());
      this.redoStack.push(command);
      this.updateStoreFlags();
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      command.do(this.store.getState());
      this.undoStack.push(command);
      this.updateStoreFlags();
    }
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}

export const history = new HistoryManager(usePianoRollStore);
