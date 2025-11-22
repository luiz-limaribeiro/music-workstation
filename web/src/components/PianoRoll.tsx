import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import Keys from "./Keys";
import NotesTimeline from "./NotesTimeline";
import { startMove } from "../common/startMove";
import { pianoKeys, type PianoKey } from "../data/pianoKeys";
import usePianoRollStore from "../store/pianoRollStore";
import { newPianoSampler } from "../samples/piano";
import "./styles/PianoRoll.css";

export default function PianoRoll() {
  const pianoRollRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<HTMLDivElement>(null);
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

  function handlePan(e: MouseEvent) {
    const timeline = timelineRef.current;
    const keys = keysRef.current;
    if (!timeline || !keys) return;

    const startTop = timeline.scrollTop;
    const startLeft = timeline.scrollLeft;

    startMove(
      e,
      timeline,
      (dx, dy) => {
        if (timeline) {
          const newTop = startTop - dy;
          timeline.scrollTop = newTop;
          timeline.scrollLeft = startLeft - dx;
        }
      },
      undefined,
      false
    );
  }

  // sync keys y pos with timeline vertical scroll
  useEffect(() => {
    const timeline = timelineRef.current;
    const keys = keysRef.current;
    if (!timeline || !keys) return;

    const syncScroll = () => {
      keys.scrollTop = timeline.scrollTop;
    };

    timeline.addEventListener("scroll", syncScroll);
    return () => timeline.removeEventListener("scroll", syncScroll);
  });

  // sync timeline y pos with keys vertical scroll
  useEffect(() => {
    const timeline = timelineRef.current;
    const keys = keysRef.current;
    if (!timeline || !keys) return;

    const syncScroll = () => {
      timeline.scrollTop = keys.scrollTop;
    };

    keys.addEventListener("scroll", syncScroll);
    return () => keys.removeEventListener("scroll", syncScroll);
  });

  // autosave
  useEffect(() => {
    const interval = setInterval(() => {
      usePianoRollStore.getState().pianoRollActions.saveStateToDB();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  });

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
      <div
        className="keys-container"
        ref={keysRef}
        onScroll={(e) => {
          e.preventDefault();
        }}
        onScrollCapture={(e) => e.preventDefault()}
      >
        <Keys onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
      </div>
      <div
        className="timeline-container"
        ref={timelineRef}
        onMouseDown={(e) => {
          if (e.buttons & 2) {
            e.preventDefault();
            handlePan(e as unknown as MouseEvent);
            document.body.classList.add("grabbing-cursor");
          }
        }}
      >
        <NotesTimeline playNote={playNote} containerRef={timelineRef.current} />
      </div>
      {!isLoaded && <span className="loading">Loading...</span>}
    </div>
  );
}
