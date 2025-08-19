import { useRef } from "react";
import "./styles/Transport.css";
import { useStore } from "../../store/store";

interface Props {
  isPlaying: boolean;
  startPlayback: () => void
  stopPlayback: () => void
}

export default function Transport({
  isPlaying,
  startPlayback,
  stopPlayback
}: Props) {
  const bpm = useStore((state) => state.bpm);
  const setBpm = useStore((state) => state.audioActions.setBpm);

  const tracks = useStore((state) => state.tracks.allIds)
  const clips = useStore((state) => state.clips.allIds)
  const sequencerTracks = useStore((state) => state.sequencerTracks.allIds)
  const steps = useStore((state) => state.steps.allIds)
  const trackClips = useStore((state) => state.trackClips)
  const clipSequencerTracks = useStore((state) => state.clipSequencerTracks)
  const sequencerTrackSteps = useStore((state => state.sequencerTrackSteps))

  const previousBpm = useRef(0);

  function handleMouseMove(event: MouseEvent) {
    previousBpm.current += event.movementX;
    previousBpm.current = Math.max(1, Math.min(999, previousBpm.current));
    setBpm(Math.round(previousBpm.current));
  }

  function handleMouseDown() {
    previousBpm.current = bpm;
    document.body.classList.add("grabbing-cursor");
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseUp() {
    document.body.classList.remove("grabbing-cursor");
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }
  
  return (
    <div className="transport">
      <button
        onClick={() => {

              console.log('')

              console.log('tracks', tracks)
              console.log('clips', clips)
              console.log('seqTracks', sequencerTracks)
              console.log('steps', steps)

              console.log('track clips: ', trackClips)
              console.log('clip seq tracks: ', clipSequencerTracks)
              console.log('seq track steps', sequencerTrackSteps)
        }}
      >
        Test
      </button>
      <button
        className="play-button"
        disabled={isPlaying}
        onClick={startPlayback}
      >
        Play
      </button>
      <button
        className="stop-button"
        disabled={!isPlaying}
        onClick={stopPlayback}
      >
        Stop
      </button>
      <div className="bpm-display" onMouseDown={handleMouseDown}>
        BPM: {bpm}
      </div>
      <div className="time-display">00:00</div>
    </div>
  );
}
