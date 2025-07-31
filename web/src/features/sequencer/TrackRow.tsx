import { useState } from "react";
import type { DrumTrack } from "./drumTrack.ts";
import "./TrackRow.css";
import SampleList from "./SampleList.tsx";
import React from "react";
import Step from "./Step.tsx";
import { useStore } from "../../store/store.ts";

interface Props {
  track: DrumTrack;
}

const TrackRow = React.memo(function TrackRow({ track }: Props) {
  const { id, name, pattern, velocity, muted } = track;

  const [showSampleList, setShowSampleList] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const setTrackVelocity = useStore((state) => state.setTrackVelocity);
  const clearPattern = useStore((state) => state.clearPattern);
  const removeTrack = useStore((state) => state.removeDrumTrack);
  const toggleMute = useStore((state) => state.toggleMute);
  const setSample = useStore((state) => state.setSample);
  const currentStep = useStore((state) => state.currentStep);

  function changeVelocity(event: React.ChangeEvent<HTMLInputElement>) {
    const newVelocity = parseFloat(event.target.value);
    setTrackVelocity(track.id, newVelocity);
  }

  function onSetSample() {
    setShowOptions(false);
    setShowSampleList(true);
  }

  function clear() {
    setShowOptions(false);
    clearPattern(track.id);
  }

  function remove() {
    setShowOptions(false);
    removeTrack(track.id);
  }

  return (
    <div className="track-row">
      <span className="track-name" onClick={() => setShowOptions(!showOptions)}>
        {name}
      </span>
      <div className="mute-unmute">
        <input
          type="button"
          className={muted ? "muted" : ""}
          onClick={() => toggleMute(track.id)}
        />
      </div>
      <div className="velocity-input">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={velocity}
          onChange={changeVelocity}
        />
      </div>
      <div className="steps">
        {pattern.map((step, stepIndex) => (
          <Step
            key={stepIndex}
            trackId={id}
            stepIndex={stepIndex}
            currentStep={currentStep}
            active={step.active}
            velocity={step.velocity}
            repeatValue={step.repeatValue}
          />
        ))}
      </div>
      {showOptions && (
        <div className="options">
          <button onClick={onSetSample}>set sample</button>
          <button onClick={clear}>clear</button>
          <button onClick={remove}>delete</button>
        </div>
      )}
      {showSampleList && (
        <SampleList
          selectedSample={name}
          onSampleSelect={(trackName, play) => {
            setSample(track.id, trackName, play);
          }}
          onClose={() => setShowSampleList(false)}
        />
      )}
    </div>
  );
});

export default TrackRow;
