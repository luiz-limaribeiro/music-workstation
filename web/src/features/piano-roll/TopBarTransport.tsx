import { useEffect, useRef } from "react";
import { buildPlayback, pausePlayback, startPlayback } from "../../playback";
import usePianoRollStore from "../../store/pianoRollStore";
import "./styles/TopBarTransport.css";

export default function TopBarTransport() {
  const isPlaying = usePianoRollStore((state) => state.isPlaying);
  const setIsPlaying = usePianoRollStore(
    (state) => state.pianoRollActions.setIsPlaying
  );

  const bpmInput = useRef<HTMLInputElement>(null);
  const bpm = usePianoRollStore((state) => state.bpm);
  const setBpm = usePianoRollStore((state) => state.pianoRollActions.setBpm);

  const time = usePianoRollStore((state) => state.playbackClock);

  function handleBpmChange(newValue: string) {
    if (newValue.length > 3) return;

    if (newValue.length < 1) {
      setBpm(0);
      return;
    }

    if (bpm === 0) {
      const value = newValue[1];
      setBpm(parseInt(value));
      if (bpmInput.current) bpmInput.current.value = value;
    }

    setBpm(parseInt(newValue));
  }

  // build and start playback on isPlaying state change
  useEffect(() => {
    if (isPlaying) {
      buildPlayback();
      startPlayback();
    } else {
      pausePlayback();
    }
  }, [isPlaying]);

  return (
    <div className="top-bar-transport">
      <span
        className={`material-symbols-outlined icon play ${
          isPlaying ? "disabled" : ""
        }`}
        onClick={() => setIsPlaying(true)}
      >
        play_arrow
      </span>
      <span
        className={`material-symbols-outlined icon pause ${
          isPlaying ? "" : "disabled"
        }`}
        onClick={() => setIsPlaying(false)}
      >
        pause
      </span>
      <span className={`material-symbols-outlined icon stop`}>stop</span>
      <div>
        <b className="bpm-label">BPM:</b>
        <input
          ref={bpmInput}
          className="bpm-input"
          type="number"
          value={bpm}
          onChange={(value) => handleBpmChange(value.currentTarget.value)}
        />
      </div>
      <span className="time">{time}</span>
    </div>
  );
}
