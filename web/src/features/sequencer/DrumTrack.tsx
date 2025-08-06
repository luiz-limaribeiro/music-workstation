import { useState } from "react";
import type { SequencerTrack } from "../../models/sequencerTrackData.ts";
import "./DrumTrack.css";
import SampleList from "./SampleList.tsx";
import React from "react";
import Step from "./Step.tsx";

interface Props {
  clipId: number;
  sequencerTrack: SequencerTrack;
  currentStep: number;
  setTrackVelocity: (sequencerTrackId: number, velocity: number) => void;
  clearSequence: (sequencerTrackId: number) => void;
  deleteSequence: (clipId: number, sequencerTrackId: number) => void;
  toggleMuted: (sequencerTrackId: number) => void;
  setSample: (
    sequencerTrackId: number,
    name: string,
    play: (time: number, velocity: number) => void
  ) => void;
  toggleStep: (sequencerTrackId: number, stepIndex: number) => void;
  setStepVelocity: (sequencerTrackId: number, stepIndex: number, velocity: number) => void;
  setStepRepeatValue: (sequencerTrackId: number, stepIndex: number, repeatValue: number) => void;
}

function DrumTrack({
  clipId,
  sequencerTrack,
  currentStep,
  setTrackVelocity,
  clearSequence,
  deleteSequence,
  toggleMuted,
  setSample,
  toggleStep,
  setStepVelocity,
  setStepRepeatValue,
}: Props) {
  const { id, name, velocity, muted, pattern } = sequencerTrack;

  const [showSampleList, setShowSampleList] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  function changeVelocity(event: React.ChangeEvent<HTMLInputElement>) {
    const newVelocity = parseFloat(event.target.value);
    setTrackVelocity(id, newVelocity);
  }

  function onSetSample() {
    setShowOptions(false);
    setShowSampleList(true);
  }

  function clear() {
    clearSequence(id);
    setShowOptions(false);
  }

  function remove() {
    deleteSequence(clipId, id);
    setShowOptions(false);
  }

  return (
    <div className="track-row">
      <span className="track-name" onClick={() => setShowOptions(!showOptions)}>
        {name}
      </span>
      <div className="mute-unmute-instrument">
        <input
          type="button"
          className={muted ? "muted" : ""}
          onClick={() => {
            toggleMuted(id);
          }}
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
            toggleStep={toggleStep}
            setStepVelocity={setStepVelocity}
            setRepeatValue={setStepRepeatValue}
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
          selectedSampleName={name}
          onSampleSelect={(sampleName, play) => {
            onSetSample();
            setSample(id, sampleName, play)
          }}
          onClose={() => setShowSampleList(false)}
        />
      )}
    </div>
  );
}

export default React.memo(DrumTrack);
