import type { PianoNote } from "../data/pianoNote";
import { buildPlayback } from "../playback";
import { type PianoRollStore } from "../store/pianoRollStore";
import { updateTimelineLength } from "./timelineLength";

export interface Command {
  do(store: PianoRollStore): void;
  undo(store: PianoRollStore): void;
}

export class AddNoteCommand implements Command {
  private note: PianoNote;

  constructor(note: PianoNote) {
    this.note = note;
  }

  do(store: PianoRollStore) {
    store.pianoRollActions.addNote(this.note);
    updateTimelineLength();

    if (store.isPlaying)
      buildPlayback();
  }

  undo(store: PianoRollStore) {
    store.pianoRollActions.removeNote(this.note.id);
    updateTimelineLength();

    if (store.isPlaying)
      buildPlayback();
  }
}

export class RemoveNoteCommand implements Command {
  private note: PianoNote;

  constructor(note: PianoNote) {
    this.note = note;
  }

  do(store: PianoRollStore) {
    store.pianoRollActions.removeNote(this.note.id);
    updateTimelineLength();

    if (store.isPlaying)
      buildPlayback();
  }

  undo(store: PianoRollStore): void {
    store.pianoRollActions.addNote(this.note);
    updateTimelineLength();

    if (store.isPlaying)
      buildPlayback();
  }
}

export class RemoveSelectedNotesCommand implements Command {
  private notes: PianoNote[] = [];

  do(store: PianoRollStore): void {
    this.notes = store.pianoRollActions.removeSelected();
    updateTimelineLength();

    if (store.isPlaying)
      buildPlayback();
  }

  undo(store: PianoRollStore): void {
    this.notes.forEach((note) => {
      store.pianoRollActions.addNote(note);
    });

    store.pianoRollActions.setSelectedNotes(
      new Set(this.notes.map((note) => note.id))
    );

    updateTimelineLength();

    if (store.isPlaying)
      buildPlayback();
  }
}

export class DuplicateSelectedNotesCommand implements Command {
  private notes: PianoNote[] = [];
  private originalSelection: Set<number> = new Set();
  private initialDo = true;

  do(store: PianoRollStore): void {
    if (this.initialDo) {
      this.originalSelection = store.selectedNotes;
      this.notes = store.pianoRollActions.duplicateSelected();
      this.initialDo = false
    } else {
      this.notes.forEach((note) => {
        store.pianoRollActions.addNote(note)
      })
      store.pianoRollActions.setSelectedNotes(new Set(this.notes.map(note => note.id)))
    }

    updateTimelineLength();
    if (store.isPlaying)
      buildPlayback()
  }

  undo(store: PianoRollStore): void {
    this.notes.forEach((note) => {
      store.pianoRollActions.removeNote(note.id);
    });

    store.pianoRollActions.setSelectedNotes(this.originalSelection);

    updateTimelineLength();
    if (store.isPlaying)
      buildPlayback();
  }
}

export interface NoteStateChange {
  before: PianoNote;
  after: PianoNote;
}

export class UpdateNoteCommand implements Command {
  private changes: Map<number, NoteStateChange>;

  constructor(changes: Map<number, NoteStateChange>) {
    this.changes = changes;
  }

  do(store: PianoRollStore): void {
    const updateNote = store.pianoRollActions.updateNote;

    this.changes.forEach((change, noteId) => {
      updateNote(noteId, () => change.after);
    });

    updateTimelineLength();

    if (store.isPlaying)
      buildPlayback();
  }

  undo(store: PianoRollStore): void {
    const updateNote = store.pianoRollActions.updateNote;

    this.changes.forEach((change, noteId) => {
      updateNote(noteId, () => change.before);
    });

    updateTimelineLength();

    if (store.isPlaying)
      buildPlayback();
  }
}
