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

  useEffect(() => {
    if (playheadRef.current) {
      const sixteenthNoteInSeconds = Tone.Time("16n").toSeconds();
      const totalSixteenths = playbackSeconds / sixteenthNoteInSeconds;
      const leftPosition = totalSixteenths * cellWidth;

      playheadRef.current.style.left = `${leftPosition}px`;
    }
  }, [playbackSeconds, cellWidth]);

  useEffect(() => {
    if (isPlaying === false && playheadRef.current)
      playheadRef.current.style.left = `${0}px`;
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
        setPlaybackSeconds(initialSeconds + secondsMoved);
        Tone.getTransport().position = initialSeconds + secondsMoved
      },
      undefined,
      false
    );
  }

  return (
    <div
      className="playhead"
      ref={playheadRef}
      style={{ transition: isPlaying ? "all .2s ease-out" : "" }}
      onMouseDown={(e) => handleMouseDown(e as unknown as MouseEvent)}
    />
  );
}
