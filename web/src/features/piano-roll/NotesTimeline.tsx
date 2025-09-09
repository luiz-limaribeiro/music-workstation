import "./styles/NotesTimeline.css";
import usePianoRollStore from "../../store/pianoRollStore";
import Grid from "./Grid";
import Note from "./Note";
import { useEffect } from "react";
import type { PianoNote } from "../../data/pianoNote";

export default function NotesTimeline() {
  const cellWidth = usePianoRollStore((state) => state.cellWidth);
  const cellHeight = usePianoRollStore((state) => state.cellHeight);
  const notesIds = usePianoRollStore((state) => state.notes.allIds);
  const addNote = usePianoRollStore((state) => state.pianoRollActions.addNote);
  const updateNote = usePianoRollStore(
    (state) => state.pianoRollActions.updateNote
  );

  useEffect(() => {
    const note: PianoNote = { id: 1, startStep: 4, length: 8, keyId: 40}
    const note2: PianoNote = { id: 2, startStep: 4, length: 8, keyId: 42}
    addNote(note)
    addNote(note2)
  }, [addNote])

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

  return (
    <div className="notes-timeline">
      <Grid />
      {notesIds.map((id) => (
        <Note key={id} noteId={id} />
      ))}
    </div>
  );
}
