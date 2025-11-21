import { useEffect, useRef } from "react";
import usePianoRollStore from "../../store/pianoRollStore";
import { startPlayback, pausePlayback, buildPlayback } from "./playback";
import "./styles/Transport.css";

export default function Transport() {
  const time = usePianoRollStore((state) => state.playbackClock);
  const isPlaying = usePianoRollStore((state) => state.isPlaying);
  const bpm = usePianoRollStore((state) => state.bpm)
  const setIsPlaying = usePianoRollStore((state) => state.pianoRollActions.setIsPlaying)
  const setBpm = usePianoRollStore(state => state.pianoRollActions.setBpm)

  const bpmRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (isPlaying) {
      buildPlayback()
      startPlayback()
    } else {
      pausePlayback()
    }
  }, [isPlaying])

  useEffect(() => {
    const el = bpmRef.current
    if (!el) return

    function handleScroll(e: WheelEvent) {
      e.preventDefault()
      const amount = e.deltaY / 120 * -1
      setBpm(bpm + (amount < 0 ? -1 : 1))
      buildPlayback()
    }

    el.addEventListener('wheel', handleScroll, { passive: false })
    return () => el.removeEventListener('wheel', handleScroll)
  }, [bpm, setBpm])

  return (
    <div className="transport">
      <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? 'stop' : 'play'}</button>
      
      <span ref={bpmRef} className="bpm">BPM: {bpm}</span>
      <span className="time">{time}</span>
    </div>
  );
}
