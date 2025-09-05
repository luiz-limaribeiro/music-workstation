import { useState } from "react";
import type { InstrumentData } from "../../data/instrumentData.ts";
import "./styles/Instrument.css";
import SampleList from "./SampleList.tsx";
import React from "react";
import StepContainer from "./StepContainer.tsx";
import type { SynthPreset } from "../../data/synthPresets.ts";

interface Props {
  stepIds: number[];
  trackId: number;
  instrument: InstrumentData;
  index: number;
  setVelocity: (instrumentId: number, velocity: number) => void;
  deleteSequence: (trackId: number, instrumentId: number) => void;
  toggleMuted: (instrumentId: number) => void;
  setSample: (
    trackId: number,
    instrumentId: number,
    synthPreset: SynthPreset
  ) => void;
  updateTrackPart: (trackId: number) => void;
}

function Instrument({
  stepIds,
  trackId,
  instrument,
  index,
  setVelocity,
  deleteSequence,
  toggleMuted,
  setSample,
  updateTrackPart,
}: Props) {
  const { id, name, velocity, muted } = instrument;

  const [showSampleList, setShowSampleList] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  function changeVelocity(event: React.ChangeEvent<HTMLInputElement>) {
    const newVelocity = parseFloat(event.target.value);
    setVelocity(id, newVelocity);
    updateTrackPart(trackId);
  }

  function onSetSample() {
    setShowOptions(false);
    setShowSampleList(true);
  }

  function onDelete() {
    deleteSequence(trackId, id);
    setShowOptions(false);
    updateTrackPart(trackId);
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
            updateTrackPart(trackId);
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
        {stepIds.map((id) => (
          <StepContainer key={id} stepId={id} trackId={trackId} />
        ))}
      </div>
      {showOptions && (
        <div className="options">
          <button onClick={onSetSample}>set sample</button>
          <button onClick={onDelete} disabled={index === 0} style={{opacity: index === 0 ? 0.3 : 1}}>
            delete
          </button>
        </div>
      )}
      {showSampleList && (
        <SampleList
          selectedSampleName={name}
          onSampleSelect={(sample) => {
            onSetSample();
            setSample(trackId, id, sample);
            updateTrackPart(trackId);
          }}
          onClose={() => setShowSampleList(false)}
        />
      )}
    </div>
  );
}

export default React.memo(Instrument);
