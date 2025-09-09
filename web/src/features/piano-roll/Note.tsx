import React from "react";
import "./styles/Note.css";
import usePianoRollStore from "../../store/pianoRollStore";

interface Props {
  noteId: number;
}

function Note({ noteId }: Props) {
  const note = usePianoRollStore((state) => state.notes.byId[noteId]);
  const cellWidth = usePianoRollStore((state) => state.cellWidth);
  const cellHeight = usePianoRollStore((state) => state.cellHeight);

  return (
    <div
      className="note"
      style={{
        position: 'absolute',
        left: note.start * cellWidth,
        top: note.keyId * cellHeight,
        width: note.length * cellWidth,
        height: cellHeight,
      }}
    />
  );
}

export default React.memo(Note);
