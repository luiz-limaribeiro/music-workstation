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

export default function PianoRoll() {
  const pianoRollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const samplerRef = useRef<Tone.Sampler>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  const stepWidth = usePianoRollStore((state) => state.stepWidth);
  const stepHeight = usePianoRollStore((state) => state.stepHeight);
  const updateCellDimensions = usePianoRollStore(
    (state) => state.pianoRollActions.updateCellDimensions
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
        updateCellDimensions(stepWidth + factor, stepHeight + factor);
      }
    }

    el.addEventListener("wheel", handleZoom, { passive: false });
    return () => el.removeEventListener("wheel", handleZoom);
  }, [updateCellDimensions, stepWidth, stepHeight]);

  // Horizontal zoom
  useEffect(() => {
    const el = horizontalRef.current;
    if (!el) return;

    function handleZoom(e: WheelEvent) {
      e.preventDefault();
      const factor = (e.deltaY / 120) * -1;
      updateCellDimensions(stepWidth + factor, stepHeight);
    }

    el.addEventListener("wheel", handleZoom, { passive: false });
    return () => el.removeEventListener("wheel", handleZoom);
  }, [updateCellDimensions, stepWidth, stepHeight]);

  // Vertical zoom
  useEffect(() => {
    const el = verticalRef.current;
    if (!el) return;

    function handleZoom(e: WheelEvent) {
      e.preventDefault();
      const factor = (e.deltaY / 120) * -1;
      updateCellDimensions(stepWidth, stepHeight + factor);
    }

    el.addEventListener("wheel", handleZoom, { passive: false });
    return () => el.removeEventListener("wheel", handleZoom);
  }, [updateCellDimensions, stepWidth, stepHeight]);

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
        <NotesTimeline playNote={playNote} containerRef={timelineRef.current} />
      </div>
      {!isLoaded && <span className="loading">Loading...</span>}
      <Transport />
    </div>
  );
}
