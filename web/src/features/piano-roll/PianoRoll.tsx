import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import Keys from "./Keys";
import NotesTimeline from "./NotesTimeline";
import "./styles/PianoRoll.css";
import { startMove } from "../../common/startMove";
import { pianoKeys, type PianoKey } from "../../data/pianoKeys";
import usePianoRollStore from "../../store/pianoRollStore";
import { newPianoSampler } from "../../samples/piano";
import Transport from "./Transport";
import AutoSaver from "./AutoSaver";

export default function PianoRoll() {
  const pianoRollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const samplerRef = useRef<Tone.Sampler>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const cellWidth = usePianoRollStore((state) => state.cellWidth);
  const cellHeight = usePianoRollStore((state) => state.cellHeight);
  const updateCellDimensions = usePianoRollStore(
    (state) => state.pianoRollActions.updateCellDimensions
  );

  const loadState = usePianoRollStore(
    (s) => s.pianoRollActions.loadStateFromDB
  );
  const saveState = usePianoRollStore((s) => s.pianoRollActions.saveStateToDB);
  const clearState = usePianoRollStore(
    (s) => s.pianoRollActions.clearStateInDB
  );

  // Setup sampler
  useEffect(() => {
    samplerRef.current = newPianoSampler(() => {
      setIsLoaded(true);
    });

    return () => {
      samplerRef.current?.dispose();
    };
  }, []);

  // Handle wheel zoom
  useEffect(() => {
    const el = pianoRollRef.current;
    if (!el) return;

    function handleZoom(e: WheelEvent) {
      if (e.ctrlKey) {
        e.preventDefault();
        const factor = (e.deltaY / 120) * -1;
        updateCellDimensions(cellWidth + factor, cellHeight + factor);
      }
    }

    el.addEventListener("wheel", handleZoom, { passive: false });
    return () => el.removeEventListener("wheel", handleZoom);
  }, [updateCellDimensions, cellWidth, cellHeight]);

  // Horizontal zoom
  useEffect(() => {
    const el = horizontalRef.current;
    if (!el) return;

    function handleZoom(e: WheelEvent) {
      e.preventDefault();
      const factor = (e.deltaY / 120) * -1;
      updateCellDimensions(cellWidth + factor, cellHeight);
    }

    el.addEventListener("wheel", handleZoom, { passive: false });
    return () => el.removeEventListener("wheel", handleZoom);
  }, [updateCellDimensions, cellWidth, cellHeight]);

  // Vertical zoom
  useEffect(() => {
    const el = verticalRef.current;
    if (!el) return;

    function handleZoom(e: WheelEvent) {
      e.preventDefault();
      const factor = (e.deltaY / 120) * -1;
      updateCellDimensions(cellWidth, cellHeight + factor);
    }

    el.addEventListener("wheel", handleZoom, { passive: false });
    return () => el.removeEventListener("wheel", handleZoom);
  }, [updateCellDimensions, cellWidth, cellHeight]);

  // Load state
  useEffect(() => {
    loadState();
  }, [loadState]);

  function handleHorizontalScroll(e: MouseEvent) {
    if (!timelineRef.current) return;
    const startLeft = timelineRef.current.scrollLeft;

    startMove(
      e,
      timelineRef.current,
      (dx) => {
        if (timelineRef.current) {
          timelineRef.current.scrollLeft = startLeft - dx;
        }
      },
      undefined,
      false
    );
  }

  function handleKeyDown(key: PianoKey) {
    samplerRef.current?.triggerAttack(key.note + key.octave);
  }

  function handleKeyUp(key: PianoKey) {
    samplerRef.current?.triggerRelease(key.note + key.octave);
  }

  function playNote(midi: number) {
    const key = pianoKeys[midi];
    samplerRef.current?.triggerAttackRelease(key.note + key.octave, "8n");
  }

  return (
    <div className="piano-roll" ref={pianoRollRef}>
      <div className="zoom horizontal-zoom" ref={horizontalRef} />
      <div className="zoom vertical-zoom" ref={verticalRef} />
      <div className="controls">
        <button onClick={saveState}>save</button>
        <button onClick={clearState}>clear</button>
        <button onClick={loadState}>load</button>
      </div>
      <div
        className="keys-container"
        onMouseDown={() => {
          if (Tone.getContext().state !== "running") {
            Tone.start();
            Tone.getContext().resume();
          }
        }}
      >
        <Keys onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
      </div>
      <div
        className="timeline-container"
        ref={timelineRef}
        onMouseDown={(e) => {
          if (e.buttons & 2) {
            e.preventDefault();
            handleHorizontalScroll(e as unknown as MouseEvent);
            document.body.classList.add("grabbing-cursor");
          }
        }}
      >
        <NotesTimeline playNote={playNote} />
      </div>
      {!isLoaded && <span className="loading">Loading...</span>}
      <Transport />
      <AutoSaver />
    </div>
  );
}
