import "./styles/NotesTimeline.css";
import usePianoRollStore from "../../store/pianoRollStore";
import Grid from "./Grid";
import { useRef } from "react";
import { newPianoNote } from "../../data/pianoNote";
import { startMove } from "../../common/startMove";
import { pianoKeys } from "../../data/pianoKeys";
import Playhead from "./Playhead";
import Notes from "./Notes";
import { updateTimelineLength } from "../../common/timelineLength";
import { buildPlayback } from "./playback";

const LENGTH = 80

interface Props {
  timelineOffsetX: number;
  playNote: (midi: number) => void;
}

export default function NotesTimeline({ timelineOffsetX, playNote }: Props) {
  const cellWidth = usePianoRollStore((state) => state.cellWidth);
  const cellHeight = usePianoRollStore((state) => state.cellHeight);
  const addNote = usePianoRollStore((state) => state.pianoRollActions.addNote);
  const selectNote = usePianoRollStore(
    (state) => state.pianoRollActions.selectNote
  );
  const resetSelected = usePianoRollStore(
    (state) => state.pianoRollActions.resetSelected
  );
  const removeSelected = usePianoRollStore(
    (state) => state.pianoRollActions.removeSelected
  );
  const duplicateSelected = usePianoRollStore(
    (state) => state.pianoRollActions.duplicatedSelected
  );

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

  function handleAddNote(e: React.MouseEvent) {
    const timelineRect = timelineRef.current?.getBoundingClientRect();
    if (!timelineRect) return;

    const length = usePianoRollStore.getState().recentNoteLength;
    const x = e.clientX - timelineRect.x;
    const y = e.clientY - timelineRect.y;
    const pos = pixelsToGrid(x, y);
    const newNote = newPianoNote(pos.col, length, pos.row)
    addNote(newNote);
    playNote(pos.row);
    updateTimelineLength()
    buildPlayback()
  }

  function handleSelectionBox(e: MouseEvent) {
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect || !timelineRef.current) return;

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
        if (!boxRef.current || !timelineRef.current) return;
        const boxRect = boxRef.current.getBoundingClientRect();
        const timelineRect = timelineRef.current.getBoundingClientRect();

        const leftTop = pixelsToGrid(
          boxRect.left - timelineRect.left + timelineRef.current.scrollLeft,
          boxRect.top - timelineRect.top + timelineRef.current.scrollTop
        );
        const rightBottom = pixelsToGrid(
          boxRect.right - timelineRect.left + timelineRef.current.scrollLeft,
          boxRect.bottom - timelineRect.top + timelineRef.current.scrollTop
        );

        const notesIds = usePianoRollStore.getState().notes.allIds;
        const notes = usePianoRollStore.getState().notes.byId;

        const boxLeft = Math.min(leftTop.col, rightBottom.col);
        const boxRight = Math.max(leftTop.col, rightBottom.col);
        const boxTop = Math.min(leftTop.row, rightBottom.row);
        const boxBottom = Math.max(leftTop.row, rightBottom.row);

        for (const id of notesIds) {
          const note = notes[id];
          const noteLeft = note.start;
          const noteRight = note.start + note.length;
          const noteTop = note.keyId;
          const noteBottom = note.keyId + 1;

          if (
            noteLeft < boxRight - 1 &&
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
      true
    );
  }

  return (
    <div
      ref={timelineRef}
      className="notes-timeline"
      style={{
        width: LENGTH * cellWidth,
        height: pianoKeys.length * cellHeight,
        position: "relative",
      }}
      onMouseDown={(e) => {
        if (!e.ctrlKey && e.buttons & 1) {
          resetSelected();
        }

        if (!e.shiftKey && e.buttons & 1) {
          handleSelectionBox(e as unknown as MouseEvent);
          adding.current = true;
        }
      }}
      onMouseUp={(e) => {
        if (boxRef.current) {
          const rect = boxRef.current.getBoundingClientRect();

          if (adding.current && rect.width < 20 && rect.height < 20) {
            handleAddNote(e);
            if (timelineRef.current) timelineRef.current.focus();
          }
        }

        adding.current = false;
        document.body.classList.remove("grabbing-cursor");
      }}
      onMouseLeave={() => {
        document.body.classList.remove("grabbing-cursor");
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Delete") {
          removeSelected();
          updateTimelineLength()
        }

        if (e.ctrlKey && (e.key === "d" || e.key === "D")) {
          e.preventDefault();
          duplicateSelected()
          updateTimelineLength()
        }
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Grid
        cellWidth={cellWidth}
        cellHeight={cellHeight}
        offsetX={timelineOffsetX}
        offsetY={0}
      />
      { timelineRef.current && <Notes timelineRef={timelineRef.current} playNote={playNote} /> }
      <div ref={selectionOverlayRef} className="selection-overlay">
        <div ref={boxRef} className="selection-box" />
      </div>
      <Playhead />
    </div>
  );
}
