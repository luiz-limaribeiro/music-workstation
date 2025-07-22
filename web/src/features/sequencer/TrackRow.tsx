import { useState } from "react";
import type { Track } from "./track";
import "./TrackRow.css";
import SampleList from "./SampleList";
import React from "react";

const stepColors = [0, 1, 2, 3, 8, 9, 10, 11];

interface Props {
  track: Track;
  currentStep: number;
  onToggleStep: (trackId: number, stepId: number) => void;
  onChangeVelocity: (volume: number) => void;
  onMute: () => void;
  onClear: () => void,
  onDelete: () => void,
  onSampleSelect: (
    trackName: string,
    play: (time: number, velocity: number) => void
  ) => void;
}

const TrackRow = React.memo(function TrackRow({
  track,
  currentStep,
  onToggleStep,
  onChangeVelocity,
  onMute,
  onClear,
  onDelete,
  onSampleSelect,
}: Props) {
  const { id, name, pattern, velocity, muted } = track;

  const [showSampleList, setShowSampleList] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  function changeVelocity(event: React.ChangeEvent<HTMLInputElement>) {
    const newVelocity = parseFloat(event.target.value);
    onChangeVelocity(newVelocity);
  }

  function onSetSample() {
    setShowOptions(false);
    setShowSampleList(true);
  }

  function clear() {
    setShowOptions(false);
    onClear()
  }

  function remove() {
    setShowOptions(false);
    onDelete()
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
          onClick={() => onMute()}
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
          <div
            key={stepIndex}
            className={`step
                  ${stepColors.includes(stepIndex) ? "other-color" : ""}
                  ${step.active ? "active" : ""}
                  ${currentStep === stepIndex ? "current" : ""}`}
            onClick={() => onToggleStep(id, stepIndex)}
          ></div>
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
          selectedSample={track.name}
          onSampleSelect={onSampleSelect}
          onClose={() => setShowSampleList(false)}
        />
      )}
    </div>
  );
});

export default TrackRow;