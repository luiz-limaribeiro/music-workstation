import * as Tone from "tone";
import { useEffect, useRef } from "react";
import { startMove } from "../common/startMove";
import { stepsToToneTime, toneTimeToSteps } from "../common/syncHelper";
import usePianoRollStore from "../store/pianoRollStore";
import "./styles/Playhead.css";
import { updateClock } from "../common/clockHelper";

export default function Playhead() {
  const cellWidth = usePianoRollStore((state) => state.stepWidth);
  const isPlaying = usePianoRollStore((state) => state.isPlaying);

  const playheadRef = useRef<HTMLDivElement>(null);
  const animationId = useRef(0);

  // move playhead on playback start
  useEffect(() => {
    const el = playheadRef.current;
    if (!el) return;

    const transport = Tone.getTransport();

    function movePlayhead() {
      const pos = transport.position;
      const steps = toneTimeToSteps(pos.toString())
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
    const transport = Tone.getTransport()
    const initialStep = toneTimeToSteps(transport.position.toString())
    const playhead = playheadRef.current

    startMove(
      e,
      playhead,
      (dx) => {
        const numberOfSixteenthsMoved = dx / cellWidth;
        const newPos = Math.max(0, initialStep + numberOfSixteenthsMoved)
        const pixelPos = newPos * cellWidth
        transport.position = stepsToToneTime(newPos)
        if (playhead)
          playhead.style.left = `${pixelPos}px`
        updateClock()
      },
      () => {
        // in case of lag
        // updateClock()
      },
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
