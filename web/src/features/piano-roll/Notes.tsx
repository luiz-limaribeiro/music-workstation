import * as Tone from "tone";
import { startMove } from "../../common/startMove";
import { pianoKeys } from "../../data/pianoKeys";
import usePianoRollStore from "../../store/pianoRollStore";
import Note from "./Note";
import type { PianoNote } from "../../data/pianoNote";
import { UpdateNoteCommand, type NoteStateChange } from "../../common/command";
import { dawHistory } from "../../common/historyManager";

interface Props {
  timelineRef: HTMLDivElement;
  playNote: (midi: number) => void;
}

export default function Notes({ timelineRef, playNote }: Props) {
  const notesIds = usePianoRollStore((state) => state.notes.allIds);
  const cellWidth = usePianoRollStore((state) => state.cellWidth);
  const cellHeight = usePianoRollStore((state) => state.cellHeight);
  const selectNote = usePianoRollStore(
    (state) => state.pianoRollActions.selectNote
  );

  const setRecentNoteLength = usePianoRollStore(
    (state) => state.pianoRollActions.setRecentNoteLength
  );

  function handleNoteMove(e: MouseEvent) {
    const store = usePianoRollStore.getState();
    const selectedNotes = store.selectedNotes;

    const changes = new Map<number, NoteStateChange>();
    const initialNoteStates = new Map<number, PianoNote>();

    for (const noteId of selectedNotes) {
      initialNoteStates.set(noteId, { ...store.notes.byId[noteId] });
    }

    const updateNote = store.pianoRollActions.updateNote;

    let completedMoves = 0;
    const totalMoves = selectedNotes.size;

    const completeMove = () => {
      if (completedMoves === totalMoves) {
        if (changes.size > 0) {
          const command = new UpdateNoteCommand(changes);
          dawHistory.doCommand(command);
        }
      }
    };

    for (const noteId of selectedNotes) {
      const note = initialNoteStates.get(noteId)!;
      const originalStart = note.start;
      const originalMidi = note.keyId;

      let start = originalStart;
      let midi = originalMidi;

      startMove(
        e,
        timelineRef,
        (dx, dy) => {
          const deltaCols = Math.round(dx / cellWidth);
          const deltaRows = Math.round(dy / cellHeight);

          const newStart = Math.max(0, originalStart + deltaCols);
          const newMidi = Math.min(
            pianoKeys.length - 1,
            Math.max(0, originalMidi + deltaRows)
          );

          if (newMidi !== midi && Tone.getTransport().state !== "started") {
            playNote(newMidi);
          }

          if (newStart !== start || newMidi !== midi) {
            start = newStart;
            midi = newMidi;
            updateNote(note.id, (note) => ({
              ...note,
              start: newStart,
              keyId: newMidi,
            }));
          }
        },
        () => {
          const initialNote = initialNoteStates.get(noteId)!;
          const updatedStore = usePianoRollStore.getState();
          const updatedNote = updatedStore.notes.byId[noteId];

          if (
            initialNote.start !== updatedNote.start ||
            initialNote.keyId !== updatedNote.keyId
          ) {
            changes.set(noteId, {
              before: initialNote,
              after: updatedNote,
            });
          }

          ++completedMoves;
          completeMove();
        }
      );
    }
  }

  function handleNoteResize(e: MouseEvent) {
    const store = usePianoRollStore.getState();
    const selectedNotes = store.selectedNotes;

    const changes = new Map<number, NoteStateChange>();
    const initialNoteStates = new Map<number, PianoNote>();

    for (const noteId of selectedNotes) {
      initialNoteStates.set(noteId, { ...store.notes.byId[noteId] });
    }

    const updateNote = store.pianoRollActions.updateNote;

    let completedMoves = 0;
    const totalMoves = selectedNotes.size;

    const completeMove = () => {
      if (completedMoves === totalMoves) {
        if (changes.size > 0) {
          const command = new UpdateNoteCommand(changes);
          dawHistory.doCommand(command);
        }
      }
    };

    for (const noteId of selectedNotes) {
      const note = initialNoteStates.get(noteId)!;
      const originalLength = note.length;
      let length = originalLength;

      startMove(
        e,
        timelineRef,
        (dx) => {
          const deltaCols = Math.round(dx / cellWidth);
          const newLength = originalLength + deltaCols;

          if (newLength !== length) {
            length = newLength;
            updateNote(note.id, (note) => ({
              ...note,
              length: newLength >= 1 ? newLength : 1,
            }));
          }
        },
        () => {
          const initialNote = initialNoteStates.get(noteId)!;
          const updatedStore = usePianoRollStore.getState();
          const updatedNote = updatedStore.notes.byId[noteId];

          if (initialNote.length !== updatedNote.length) {
            changes.set(noteId, {
              before: initialNote,
              after: updatedNote,
            });
          }

          ++completedMoves;
          completeMove();
          setRecentNoteLength(note.length);
        }
      );
    }
  }

  return (
    <div>
      {notesIds.map((id) => (
        <Note
          key={id}
          noteId={id}
          selectNote={selectNote}
          onMove={handleNoteMove}
          onResize={handleNoteResize}
        />
      ))}
    </div>
  );
}
