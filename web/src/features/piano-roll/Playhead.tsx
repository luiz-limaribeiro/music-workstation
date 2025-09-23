import * as Tone from "tone";
import { useEffect, useRef } from "react";
import usePianoRollStore from "../../store/pianoRollStore";
import "./styles/Playhead.css";
import { startMove } from "../../common/startMove";

export default function Playhead() {
  const playbackSeconds = usePianoRollStore((state) => state.playbackSeconds);
  const cellWidth = usePianoRollStore((state) => state.cellWidth);
  const isPlaying = usePianoRollStore((state) => state.isPlaying);
  const setPlaybackSeconds = usePianoRollStore(
    (state) => state.pianoRollActions.setPlaybackSeconds
  );

  const playheadRef = useRef<HTMLDivElement>(null);
  const animationId = useRef(0);

  useEffect(() => {
    const el = playheadRef.current;
    if (!el) return;

    const transport = Tone.getTransport();

    function movePlayhead() {
      const pos = transport.position;
      const [bars, beats, sixteenths] = pos.toString().split(":");
      const steps = Number(bars) * 16 + Number(beats) * 4 + Number(sixteenths);
      const pixelPos = steps * cellWidth;

      if (el) el.style.left = `${pixelPos}px`;

      animationId.current = requestAnimationFrame(movePlayhead)
    }

    if (isPlaying) {
      movePlayhead();
    } else {
      el.style.left = `${0}px`;
      cancelAnimationFrame(animationId.current);
    }

    return () => {
      cancelAnimationFrame(animationId.current);
    }
  }, [isPlaying]);

  function handleMouseDown(e: MouseEvent) {
    e.stopPropagation();
    const initialSeconds = playbackSeconds;

    startMove(
      e,
      playheadRef.current,
      (dx) => {
        const numberOfSixteenthsMoved = dx / cellWidth;
        const secondsMoved =
          numberOfSixteenthsMoved * Tone.Time("16n").toSeconds();
        const newPos = Math.max(0, initialSeconds + secondsMoved);
        setPlaybackSeconds(newPos);
        Tone.getTransport().position = newPos;
      },
      undefined,
      false
    );
  }

  return (
    <div
      className='playhead'
      ref={playheadRef}
      onMouseDown={(e) => handleMouseDown(e as unknown as MouseEvent)}
    />
  );
}
