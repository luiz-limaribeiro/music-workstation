import { useState } from "react";
import "./Sequencer.css";

const tracks = ["kick", "snare", "hihat"];
const initialSequence = [
  Array(16).fill(0),
  Array(16).fill(0),
  Array(16).fill(0),
];
const stepsColors = [0, 1, 2, 3, 8, 9, 10, 11];

export default function Sequencer() {
  const [sequence, setSequence] = useState<any[][]>(initialSequence);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120)

  function toggleStep(trackId: number, stepId: number) {
    let newSequence = [...sequence];
    newSequence[trackId][stepId] = newSequence[trackId][stepId] ? 0 : 1;
    setSequence(newSequence);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function changeBpm(event: React.WheelEvent) {
    let newBpm = bpm + -(event.deltaY / 100)
    setBpm(Math.max(20, Math.min(newBpm, 240)))
  }

  return (
    <div className="sequencer">
      <div className="controls">
        <span className="bpm-label" onWheel={changeBpm}>BPM: {bpm}</span>
        <button className="play-button" onClick={togglePlay}>
          {isPlaying ? "stop" : "start"}
        </button>
      </div>
      {tracks.map((track, trackId) => (
        <div key={trackId} className="track-row">
          <span>{track}</span>
          <div className="steps">
            {sequence[trackId].map((step, stepId) => (
              <div
                key={stepId}
                className={`step
                  ${stepsColors.includes(stepId) ? "other-color" : ""}
                  ${step ? "active" : ""}`}
                onClick={() => toggleStep(trackId, stepId)}
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
