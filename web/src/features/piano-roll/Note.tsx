import React from "react";
import "./styles/Note.css";
import usePianoRollStore from "../../store/pianoRollStore";
import { dawHistory } from "../../common/historyManager";
import { RemoveNoteCommand } from "../../common/command";

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
  const selected = usePianoRollStore((state) =>
    state.selectedNotes.has(noteId)
  );

  const resetSelected = usePianoRollStore(
    (state) => state.pianoRollActions.resetSelected
  );
  const unselectNote = usePianoRollStore(
    (state) => state.pianoRollActions.unselectNote
  );

  return (
    <div
      className={`note ${selected ? "selected" : ""}`}
      onMouseDown={(e) => {
        if (!(e.buttons & 1)) return;
        e.stopPropagation();

        if (e.shiftKey) {
          const command = new RemoveNoteCommand(note);
          dawHistory.doCommand(command);
          resetSelected()
          return
        }

        if (!e.ctrlKey && !selected) resetSelected();

        if (e.ctrlKey) {
          if (selected) {
            unselectNote(noteId);
            return;
          }
        }

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
        if (e.buttons & 1 && e.shiftKey) {
          const command = new RemoveNoteCommand(note);
          dawHistory.doCommand(command);
        }
      }}
    >
      <div
        className={`resize-handler`}
        onMouseDown={(e) => {
          if (e.buttons & 1) {
            if (!selected) resetSelected();
            e.stopPropagation();
            selectNote(noteId);
            onResize(e as unknown as MouseEvent);
          }
        }}
      />
    </div>
  );
}

export default React.memo(Note);
