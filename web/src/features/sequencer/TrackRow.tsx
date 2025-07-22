import { useState, type ActionDispatch } from "react";
import type { Track } from "./track";
import "./TrackRow.css";
import SampleList from "./SampleList";
import React from "react";
import type { TrackAction } from "./trackReducer";

const stepColors = [0, 1, 2, 3, 8, 9, 10, 11];

interface Props {
  track: Track;
  currentStep: number;
  dispatch: ActionDispatch<[action: TrackAction]>;
}

const TrackRow = React.memo(function TrackRow({
  track,
  currentStep,
  dispatch,
}: Props) {
  const { id, name, pattern, velocity, muted } = track;

  const [showSampleList, setShowSampleList] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  function changeVelocity(event: React.ChangeEvent<HTMLInputElement>) {
    const newVelocity = parseFloat(event.target.value);
    dispatch({
      type: "SET_VELOCITY",
      id: id,
      velocity: newVelocity,
    });
  }

  function onSetSample() {
    setShowOptions(false);
    setShowSampleList(true);
  }

  function clear() {
    setShowOptions(false);
    dispatch({ type: "CLEAR", id: id });
  }

  function remove() {
    setShowOptions(false);
    dispatch({ type: "DELETE", id: id });
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
          onClick={() => dispatch({ type: "TOGGLE_MUTE", id: id })}
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
            onClick={() => dispatch({ type: "TOGGLE_STEP", id: id, stepIndex: stepIndex })}
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
          selectedSample={name}
          onSampleSelect={(trackName, play) => {
            dispatch({
              type: "UPDATE_SAMPLE",
              id: id,
              name: trackName,
              play: play,
            });
          }}
          onClose={() => setShowSampleList(false)}
        />
      )}
    </div>
  );
});

export default TrackRow;
