import * as Tone from "tone";
import { startMove } from "../../common/startMove";
import { pianoKeys } from "../../data/pianoKeys";
import usePianoRollStore from "../../store/pianoRollStore";
import Note from "./Note";
import type { PianoNote } from "../../data/pianoNote";
import { UpdateNoteCommand, type NoteStateChange } from "../../common/command";
import { dawHistory } from "../../common/historyManager";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Props {
  timelineRef: HTMLDivElement;
  timelineContainerRef: HTMLDivElement | null;
  playNote: (midi: number) => void;
}

export default function Notes({
  timelineRef,
  timelineContainerRef,
  playNote,
}: Props) {
  const [viewport, setViewport] = useState({
    scrollLeft: 0,
    scrollTop: 0,
    width: 0,
    height: 0,
  });

  const notesIds = usePianoRollStore((state) => state.notes.allIds);
  const stepWidth = usePianoRollStore((state) => state.stepWidth);
  const stepHeight = usePianoRollStore((state) => state.stepHeight);
  const selectNote = usePianoRollStore(
    (state) => state.pianoRollActions.selectNote
  );
  const setRecentNoteLength = usePianoRollStore(
    (state) => state.pianoRollActions.setRecentNoteLength
  );

  const visibleNotes = useMemo(() => {
    const { scrollLeft, scrollTop, width, height } = viewport;
    const overscan = 100;

    return notesIds.filter((id) => {
      const note = usePianoRollStore.getState().notes.byId[id];

      const left = note.start * stepWidth;
      const top = note.keyId * stepHeight;
      const noteWidth = note.length * stepWidth;
      const noteHeight = stepHeight;

      const horizontalVisible =
        left + noteWidth >= scrollLeft - overscan &&
        left <= scrollLeft + width + overscan;

      const verticalVisible =
        top + noteHeight >= scrollTop - overscan &&
        top <= scrollTop + height + overscan;

      return horizontalVisible && verticalVisible;
    });
  }, [notesIds, viewport, stepWidth, stepHeight]);

  useEffect(() => {
    const el = timelineContainerRef;
    if (!el) return;

    function update() {
      if (!el) return;
      setViewport({
        scrollLeft: el.scrollLeft,
        scrollTop: el.scrollTop,
        width: el.clientWidth,
        height: el.clientHeight,
      });
    }

    update();

    el.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [timelineContainerRef, stepWidth, stepHeight]);

  const handleNoteMove = useCallback(
    (e: MouseEvent) => {
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
            const deltaCols = Math.round(dx / stepWidth);
            const deltaRows = Math.round(dy / stepHeight);

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
    },
    [playNote, stepHeight, stepWidth, timelineRef]
  );

  const handleNoteResize = useCallback(
    (e: MouseEvent) => {
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
            const deltaCols = Math.round(dx / stepWidth);
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
    },
    [stepWidth, timelineRef, setRecentNoteLength]
  );

  const handleVelocityChange = useCallback(
    (e: MouseEvent) => {
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
        const startVelocity = note.velocity;

        startMove(
          e,
          timelineRef,
          (_, dy) => {
            const velocityChange = Math.floor(dy / 3);
            const newVelocity = Math.min(
              127,
              Math.max(1, startVelocity + velocityChange)
            );

            updateNote(note.id, (note) => ({
              ...note,
              velocity: newVelocity,
            }));
          },
          () => {
            const initialNote = initialNoteStates.get(noteId)!;
            const updatedStore = usePianoRollStore.getState();
            const updatedNote = updatedStore.notes.byId[noteId];

            if (initialNote.velocity !== updatedNote.velocity) {
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
    },
    [timelineRef]
  );

  return (
    <div>
      {visibleNotes.map((id) => {
        return (
          <Note
            key={id}
            noteId={id}
            selectNote={selectNote}
            onMove={handleNoteMove}
            onResize={handleNoteResize}
            onVelocityChange={handleVelocityChange}
          />
        );
      })}
    </div>
  );
}
