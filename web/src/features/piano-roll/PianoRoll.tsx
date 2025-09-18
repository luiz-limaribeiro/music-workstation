import * as Tone from "tone";
import { useEffect, useRef, useState } from "react";
import Keys from "./Keys";
import NotesTimeline from "./NotesTimeline";
import "./styles/PianoRoll.css";
import { startMove } from "../../common/startMove";
import { pianoKeys, type PianoKey } from "../../data/pianoKeys";
import usePianoRollStore from "../../store/pianoRollStore";

export default function PianoRoll() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const samplerRef = useRef<Tone.Sampler>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const cellWidth = usePianoRollStore((state) => state.cellWidth);
  const cellHeight = usePianoRollStore((state) => state.cellHeight);
  const updateCellDimensions = usePianoRollStore(
    (state) => state.pianoRollActions.updateCellDimensions
  );

  const keys = pianoKeys;

  // Setup sampler
  useEffect(() => {
    samplerRef.current = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        A1: "A1.mp3",
        A2: "A2.mp3",
        A3: "A3.mp3",
        A4: "A4.mp3",
        A5: "A5.mp3",
        A6: "A6.mp3",
        A7: "A7.mp3",
        C1: "C1.mp3",
        C2: "C2.mp3",
        C3: "C3.mp3",
        C4: "C4.mp3",
        C5: "C5.mp3",
        C6: "C6.mp3",
        C7: "C7.mp3",
        C8: "C8.mp3",
        "D#1": "Ds1.mp3",
        "D#2": "Ds2.mp3",
        "D#3": "Ds3.mp3",
        "D#4": "Ds4.mp3",
        "D#5": "Ds5.mp3",
        "D#6": "Ds6.mp3",
        "D#7": "Ds7.mp3",
        "F#1": "Fs1.mp3",
        "F#2": "Fs2.mp3",
        "F#3": "Fs3.mp3",
        "F#4": "Fs4.mp3",
        "F#5": "Fs5.mp3",
        "F#6": "Fs6.mp3",
        "F#7": "Fs7.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => {
        setIsLoaded(true);
      },
    }).toDestination();

    return () => {
      samplerRef.current?.dispose();
    };
  }, []);

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
    <div className="piano-roll">
      <button
        className="zoom-in"
        onClick={() => {
          updateCellDimensions(
            Math.min(cellWidth + 4, 48),
            Math.min(cellHeight + 4, 28)
          );
        }}
      >
        +
      </button>
      <button
        className="zoom-out"
        onClick={() => {
          updateCellDimensions(
            Math.max(24, cellWidth - 4),
            Math.max(14, cellHeight - 4)
          );
        }}
      >
        -
      </button>
      <div
        className="keys-container"
        onMouseDown={() => {
          if (Tone.getContext().state !== "running") {
            Tone.start();
            Tone.getContext().resume();
          }
        }}
      >
        <Keys keys={keys} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} />
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
        <NotesTimeline playNote={playNote} timelineOffsetX={timelineRef.current?.scrollLeft || 0} />
      </div>
      {!isLoaded && <span className="loading">Loading...</span>}
    </div>
  );
}
