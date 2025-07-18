import * as Tone from 'tone'
import { useEffect, useRef, useState } from "react";
import "./Sequencer.css";

const tracks = ["kick", "snare", "hihat"];

const kick = new Tone.MembraneSynth().toDestination();
const snare = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.2,
    sustain: 0,
    release: 0.1,
  }
}).toDestination();
const hihat = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: {
    attack: 0.001,
    decay: 0.05,
    sustain: 0,
    release: 0.01,
  }
}).toDestination();

const initialSequence = [
  Array(16).fill(0),
  Array(16).fill(0),
  Array(16).fill(0),
];
const stepsColors = [0, 1, 2, 3, 8, 9, 10, 11];

export default function Sequencer() {
  const [pattern, setPattern] = useState<any[][]>(initialSequence);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120)

  function toggleStep(trackId: number, stepId: number) {
    let newSequence = [...pattern];
    newSequence[trackId][stepId] = newSequence[trackId][stepId] ? 0 : 1;
    setPattern(newSequence);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function changeBpm(event: React.WheelEvent) {
    let newBpm = bpm + -(event.deltaY / 100)
    setBpm(Math.max(20, Math.min(newBpm, 240)))
  }

  function playKick() {
    kick.triggerAttackRelease("C1", "16n")
  }

  function playSnare() {
    snare.triggerAttackRelease("16n")
  }

  function playHiHat() {
    hihat.triggerAttackRelease("16n")
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
            {pattern[trackId].map((step, stepId) => (
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
