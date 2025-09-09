import "./styles/NotesTimeline.css";
import usePianoRollStore from "../../store/pianoRollStore";
import Grid from "./Grid";
import Note from "./Note";
import { useRef } from "react";
import { newPianoNote } from "../../data/pianoNote";

export default function NotesTimeline() {
  const cellWidth = usePianoRollStore((state) => state.cellWidth);
  const cellHeight = usePianoRollStore((state) => state.cellHeight);
  const notesIds = usePianoRollStore((state) => state.notes.allIds);
  const addNote = usePianoRollStore((state) => state.pianoRollActions.addNote);
  const updateNote = usePianoRollStore(
    (state) => state.pianoRollActions.updateNote
  );

  const timelineRef = useRef<HTMLDivElement | null>(null);

  function gridToPixels(col: number, row: number) {
    return {
      x: col * cellWidth,
      y: row * cellHeight,
    };
  }

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

  return (
    <div
      ref={timelineRef}
      className="notes-timeline"
      onMouseDown={handleAddNote}
    >
      <Grid cellWidth={cellWidth} cellHeight={cellHeight} />
      {notesIds.map((id) => (
        <Note key={id} noteId={id} />
      ))}
    </div>
  );
}
