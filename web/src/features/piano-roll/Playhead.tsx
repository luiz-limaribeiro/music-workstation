import * as Tone from "tone";
import { useEffect, useRef } from "react";
import usePianoRollStore from "../../store/pianoRollStore";
import "./styles/Playhead.css";

export default function Playhead() {
  const playbackSeconds = usePianoRollStore((state) => state.playbackSeconds);
  const cellWidth = usePianoRollStore((state) => state.cellWidth);
  const playheadRef = useRef<HTMLDivElement>(null);
  const isPlaying = usePianoRollStore((state) => state.isPlaying);

  useEffect(() => {
    if (playheadRef.current) {
      const sixteenthNoteInSeconds = Tone.Time("16n").toSeconds();
      const totalSixteenths = playbackSeconds / sixteenthNoteInSeconds;
      const leftPosition = totalSixteenths * cellWidth;

      playheadRef.current.style.left = `${leftPosition}px`;
    }
  }, [playbackSeconds, cellWidth]);

  useEffect(() => {
    if (isPlaying === false && playheadRef.current) playheadRef.current.style.left = `${0}px`;
  }, [isPlaying]);

  return (
    <div
      className="playhead"
      ref={playheadRef}
      style={{ transition: isPlaying ? "all .2s ease-out" : "" }}
      onMouseDown={(e) => e.stopPropagation()}
    />
  );
}
