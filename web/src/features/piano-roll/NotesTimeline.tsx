import "./styles/NotesTimeline.css";
import usePianoRollStore from "../../store/pianoRollStore";
import Grid from "./Grid";
import Note from "./Note";
import { useRef } from "react";
import { newPianoNote, type PianoNote } from "../../data/pianoNote";
import { startMove } from "../../common/startMove";
import { pianoKeys } from "../../data/pianoKeys";

export default function NotesTimeline() {
  const cellWidth = usePianoRollStore((state) => state.cellWidth);
  const cellHeight = usePianoRollStore((state) => state.cellHeight);
  const notesIds = usePianoRollStore((state) => state.notes.allIds);
  const timelineLength = usePianoRollStore((state) => state.length);
  const addNote = usePianoRollStore((state) => state.pianoRollActions.addNote);
  const selectNote = usePianoRollStore(
    (state) => state.pianoRollActions.selectNote
  );
  const updateNote = usePianoRollStore(
    (state) => state.pianoRollActions.updateNote
  );
  const resetSelected = usePianoRollStore((state) => state.pianoRollActions.resetSelected)

  const timelineRef = useRef<HTMLDivElement>(null);
  const selectionOverlayRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const adding = useRef(false);

  function pixelsToGrid(x: number, y: number) {
    return {
      col: Math.floor(x / cellWidth),
      row: Math.floor(y / cellHeight),
    };
  }

  function gridToPixels(col: number, row: number) {
    return {
      x: col * cellWidth,
      y: row * cellHeight,
    };
  }

  function handleAddNote(e: React.MouseEvent) {
    const timelineRect = timelineRef.current?.getBoundingClientRect();
    if (!timelineRect) return;

    const x = e.clientX - timelineRect.x;
    const y = e.clientY - timelineRect.y;
    const pos = pixelsToGrid(x, y);
    addNote(newPianoNote(pos.col, 4, pos.row));
  }

  function handleNoteMove(note: PianoNote, e: MouseEvent) {
    const originalStart = note.start;
    const originalMidi = note.keyId;

    startMove(e, timelineRef.current, (dx, dy) => {
      const deltaCols = Math.round(dx / cellWidth);
      const deltaRows = Math.round(dy / cellHeight);

      const newStart = originalStart + deltaCols;
      const newMidi = originalMidi - deltaRows * -1;

      updateNote(note.id, (note) => ({
        ...note,
        start: newStart >= 0 ? newStart : 0,
        keyId:
          newMidi < 0
            ? 0
            : newMidi > pianoKeys.length - 1
            ? pianoKeys.length - 1
            : newMidi,
      }));
    });
  }

  function handleNoteResize(note: PianoNote, e: MouseEvent) {
    const originalLength = note.length;

    startMove(e, timelineRef.current, (dx) => {
      const deltaCols = Math.round(dx / cellWidth);
      const newLength = originalLength + deltaCols;

      updateNote(note.id, (note) => ({
        ...note,
        length: newLength >= 1 ? newLength : 1,
      }));
    });
  }

  function handleSelectionBox(e: MouseEvent) {
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;

    startMove(
      e,
      timelineRef.current,
      (dx, dy) => {
        if (!boxRef.current) return;
        const x = startX + dx;
        const y = startY + dy;

        boxRef.current.style.top = `${Math.min(startY, y)}px`;
        boxRef.current.style.left = `${Math.min(startX, x)}px`;
        boxRef.current.style.width = `${Math.abs(x - startX)}px`;
        boxRef.current.style.height = `${Math.abs(y - startY)}px`;
      },
      () => {
        if (!boxRef.current) return;
        const rect = boxRef.current.getBoundingClientRect();
        const leftTop = pixelsToGrid(rect.left, rect.top);
        const rightBottom = pixelsToGrid(rect.right, rect.bottom);

        const notesIds = usePianoRollStore.getState().notes.allIds;
        const notes = usePianoRollStore.getState().notes.byId;

        const boxLeft = Math.min(leftTop.col, rightBottom.col)
        const boxRight = Math.max(leftTop.col, rightBottom.col)
        const boxTop = Math.min(leftTop.row, rightBottom.row)
        const boxBottom = Math.max(leftTop.row, rightBottom.row)

        for (const id of notesIds) {
          const note = notes[id];
          const noteLeft = note.start
          const noteRight = note.start + note.length
          const noteTop = note.keyId
          const noteBottom = note.keyId + 1

          if (
            noteLeft < boxRight-1 &&
            noteRight > boxLeft &&
            noteTop < boxBottom &&
            noteBottom > boxTop
          ) {
            selectNote(id);
          }
        }

        boxRef.current.style.width = "0px";
        boxRef.current.style.height = "0px";
      },
      false
    );
  }

  return (
    <div
      ref={timelineRef}
      className="notes-timeline"
      style={{
        width: timelineLength * cellWidth,
        height: pianoKeys.length * cellHeight,
        position: "relative",
      }}
      onMouseDown={(e) => {
        if (!e.ctrlKey && e.buttons & 1) {
          resetSelected()
        }
        
        if (!e.shiftKey && e.buttons & 1) {
          handleSelectionBox(e as unknown as MouseEvent);
          adding.current = true;
        }
      }}
      onMouseUp={(e) => {
        if (boxRef.current) {
          const rect = boxRef.current.getBoundingClientRect();

          if (adding.current && rect.width < 20 && rect.height < 20)
            handleAddNote(e);
        }

        adding.current = false;
        document.body.classList.remove("grabbing-cursor");
      }}
      onMouseLeave={() => {
        document.body.classList.remove("grabbing-cursor");
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Shift") {
          if (timelineRef.current) timelineRef.current.style.cursor = "cell";
        }
      }}
      onKeyUp={(e) => {
        if (e.key === "Shift") {
          if (timelineRef.current) timelineRef.current.style.cursor = "default";
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Grid cellWidth={cellWidth} cellHeight={cellHeight} />
      {notesIds.map((id) => (
        <Note
          key={id}
          noteId={id}
          selectNote={selectNote}
          onMove={handleNoteMove}
          onResize={handleNoteResize}
        />
      ))}
      <div ref={selectionOverlayRef} className="selection-overlay">
        <div ref={boxRef} className="selection-box" />
      </div>
    </div>
  );
}
