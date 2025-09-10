import "./styles/NotesTimeline.css";
import usePianoRollStore from "../../store/pianoRollStore";
import Grid from "./Grid";
import Note from "./Note";
import { useRef } from "react";
import { newPianoNote, type PianoNote } from "../../data/pianoNote";
import { startMove } from "../../common/startMove";

export default function NotesTimeline() {
  const cellWidth = usePianoRollStore((state) => state.cellWidth);
  const cellHeight = usePianoRollStore((state) => state.cellHeight);
  const notesIds = usePianoRollStore((state) => state.notes.allIds);
  const addNote = usePianoRollStore((state) => state.pianoRollActions.addNote);
  const selectNote = usePianoRollStore(
    (state) => state.pianoRollActions.selectNote
  );
  const updateNote = usePianoRollStore(
    (state) => state.pianoRollActions.updateNote
  );

  const timelineRef = useRef<HTMLDivElement>(null);

  function pixelsToGrid(x: number, y: number) {
    return {
      col: Math.floor(x / cellWidth),
      row: Math.floor(y / cellHeight),
    };
  }

  function handleAddNote(e: React.MouseEvent) {
    const timelineRect = timelineRef.current?.getBoundingClientRect();
    if (!timelineRect || !(e.buttons & 1)) return;

    const x = e.clientX - timelineRect.x;
    const y = e.clientY - timelineRect.y;
    const pos = pixelsToGrid(x, y);
    addNote(newPianoNote(pos.col, 4, pos.row));
  }

  function handleMove(note: PianoNote, e: MouseEvent) {
    const originalStart = note.start
    const originalMidi = note.keyId

    startMove(e, timelineRef.current, (dx, dy) => {
      const deltaCols = Math.round(dx / cellWidth);
      const deltaRows = Math.round(dy / cellHeight);

      const newStart = originalStart + deltaCols

      updateNote(note.id, (note) => ({
        ...note,
        start: newStart >= 0 ? newStart : 0,
        keyId: originalMidi - deltaRows * -1,
      }));
    });
  }

  return (
    <div
      ref={timelineRef}
      className="notes-timeline"
      onMouseDown={handleAddNote}
    >
      <Grid cellWidth={cellWidth} cellHeight={cellHeight} />
      {notesIds.map((id) => (
        <Note
          key={id}
          noteId={id}
          selectNote={selectNote}
          onMove={handleMove}
        />
      ))}
    </div>
  );
}
