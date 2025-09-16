import React from "react";
import "./styles/Note.css";
import usePianoRollStore from "../../store/pianoRollStore";

interface Props {
  noteId: number;
  selectNote: (noteId: number) => void;
  onMove: (e: MouseEvent) => void;
  onResize: (e: MouseEvent) => void;
}

function Note({ noteId, selectNote, onMove, onResize }: Props) {
  const note = usePianoRollStore((state) => state.notes.byId[noteId]);
  const cellWidth = usePianoRollStore((state) => state.cellWidth);
  const cellHeight = usePianoRollStore((state) => state.cellHeight);
  const selected = usePianoRollStore(
    (state) => state.selectedNotes.has(noteId)
  );
  const remove = usePianoRollStore(
    (state) => state.pianoRollActions.removeNote
  );
  const resetSelected = usePianoRollStore(
    state => state.pianoRollActions.resetSelected
  )

  return (
    <div
      className={`note ${selected ? "selected" : ""}`}
      onMouseDown={(e) => {
        if (!(e.buttons & 1)) return;
        if (e.shiftKey) remove(noteId);

        e.stopPropagation();
        if (!(e.ctrlKey) && !selected)
          resetSelected()

        selectNote(noteId);
        onMove(e as unknown as MouseEvent);
      }}
      style={{
        position: "absolute",
        left: note.start * cellWidth,
        top: note.keyId * cellHeight,
        width: note.length * cellWidth,
        height: cellHeight,
      }}
      onMouseEnter={(e) => {
        if (e.buttons & 1 && e.shiftKey) remove(noteId);
      }}
    >
      <div
        className={`resize-handler`}
        onMouseDown={(e) => {
          if (e.buttons & 1) {
            e.stopPropagation();
            selectNote(noteId)
            onResize(e as unknown as MouseEvent);
          }
        }}
      />
    </div>
  );
}

export default React.memo(Note);
