import * as Tone from 'tone'
import { startMove } from "../../common/startMove";
import { updateTimelineLength } from "../../common/timelineLength";
import { pianoKeys } from "../../data/pianoKeys";
import usePianoRollStore from "../../store/pianoRollStore";
import Note from "./Note";
import { buildPlayback } from "./playback";

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
  const updateNote = usePianoRollStore(
    (state) => state.pianoRollActions.updateNote
  );
  const setRecentNoteLength = usePianoRollStore(
    (state) => state.pianoRollActions.setRecentNoteLength
  );

  function handleNoteMove(e: MouseEvent) {
    const selectedNotes = usePianoRollStore.getState().selectedNotes;

    for (const noteId of selectedNotes) {
      const note = usePianoRollStore.getState().notes.byId[noteId];
      const originalStart = note.start;
      const originalMidi = note.keyId;

      let start = note.start;
      let midi = note.keyId;

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
          {
            updateTimelineLength();
            buildPlayback();
          }
        }
      );
    }
  }

  function handleNoteResize(e: MouseEvent) {
    const selectedNotes = usePianoRollStore.getState().selectedNotes;
    for (const noteId of selectedNotes) {
      const note = usePianoRollStore.getState().notes.byId[noteId];
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
          for (const noteId of selectedNotes) {
            const note = usePianoRollStore.getState().notes.byId[noteId];
            setRecentNoteLength(note.length);
            updateTimelineLength();
            buildPlayback()
          }
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
