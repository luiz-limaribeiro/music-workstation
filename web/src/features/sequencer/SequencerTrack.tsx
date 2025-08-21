import { useState } from "react";
import type { SequencerTrack } from "../../data/sequencerTrackData.ts";
import "./SequencerTrack.css";
import SampleList from "./SampleList.tsx";
import React from "react";
import StepContainer from "./StepContainer.tsx";

interface Props {
  clipId: number;
  stepIds: number[];
  trackId: number;
  sequencerTrack: SequencerTrack;
  setTrackVelocity: (sequencerTrackId: number, velocity: number) => void;
  clearSequence: (sequencerTrackId: number) => void;
  deleteSequence: (clipId: number, sequencerTrackId: number) => void;
  toggleMuted: (sequencerTrackId: number) => void;
  setSample: (
    sequencerTrackId: number,
    name: string,
    play: (time: number, velocity: number) => void
  ) => void;
  updateTrackPart: (trackId: number) => void;
}

function SequencerTrack({
  clipId,
  stepIds,
  trackId,
  sequencerTrack,
  setTrackVelocity,
  clearSequence,
  deleteSequence,
  toggleMuted,
  setSample,
  updateTrackPart,
}: Props) {
  const { id, name, velocity, muted } = sequencerTrack;

  const [showSampleList, setShowSampleList] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  function changeVelocity(event: React.ChangeEvent<HTMLInputElement>) {
    const newVelocity = parseFloat(event.target.value);
    setTrackVelocity(id, newVelocity);
    updateTrackPart(trackId)
  }

  function onSetSample() {
    setShowOptions(false);
    setShowSampleList(true);
    updateTrackPart(trackId)
  }

  function clear() {
    clearSequence(id);
    setShowOptions(false);
    updateTrackPart(trackId)
  }

  function remove() {
    deleteSequence(clipId, id);
    setShowOptions(false);
    updateTrackPart(trackId)
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
          <StepContainer
            key={id}
            stepId={id}
            trackId={trackId}
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
            setSample(id, sampleName, play);
          }}
          onClose={() => setShowSampleList(false)}
        />
      )}
    </div>
  );
}

export default React.memo(SequencerTrack);
