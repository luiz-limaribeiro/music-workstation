import { useState, type ActionDispatch } from "react";
import type { SequencerTrack } from "./sequencerTrackData.ts";
import "./TrackRow.css";
import SampleList from "./SampleList.tsx";
import React from "react";
import Step from "./Step.tsx";
import { useStore } from "../../store/store.ts";
import type { SequencerAction } from "./sequencerReducer.ts";

interface Props {
  sequencerTrack: SequencerTrack;
  dispatch: ActionDispatch<[action: SequencerAction]>;
}

const TrackRow = React.memo(function TrackRow({
  sequencerTrack: track,
  dispatch,
}: Props) {
  const { id, name, velocity, muted, pattern } = track;

  const [showSampleList, setShowSampleList] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const currentStep = useStore((state) => state.currentStep);

  function changeVelocity(event: React.ChangeEvent<HTMLInputElement>) {
    const newVelocity = parseFloat(event.target.value);
    dispatch({
      type: "SET_TRACK_VELOCITY",
      trackId: id,
      velocity: newVelocity,
    });
  }

  function onSetSample() {
    setShowOptions(false);
    setShowSampleList(true);
  }

  function clear() {
    setShowOptions(false);
    dispatch({ type: "CLEAR", trackId: id });
  }

  function remove() {
    setShowOptions(false);
    dispatch({ type: "DELETE", trackId: id });
  }

  return (
    <div className="track-row">
      <span className="track-name" onClick={() => setShowOptions(!showOptions)}>
        {name}
      </span>
      <div className="mute-unmute-instrument">
        <input type="button" className={muted ? "muted" : ""} />
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
            dispatch={dispatch}
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
          onSampleSelect={() => {
            onSetSample();
          }}
          onClose={() => setShowSampleList(false)}
        />
      )}
    </div>
  );
});

export default TrackRow;
