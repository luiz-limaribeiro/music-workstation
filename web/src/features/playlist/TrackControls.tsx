import { useState } from "react";
import Knob from "../../common/Knob";
import "./styles/TrackControls.css";
import React from "react";
import { useStore } from "../../store/store";

interface Props {
  trackId: number;
  selectedTrackId: number;
  isPlaybackRunning: boolean;
  selectTrack: (trackId: number) => void;
  updateVelocity: (trackId: number, velocity: number) => void;
  updatePanning: (trackId: number, panning: number) => void;
  toggleMuted: (trackId: number) => void;
  toggleSolo: (trackId: number) => void;
  deleteTrack: (trackId: number) => void;
  rename: (trackId: number, name: string) => void;
  updateTrackPart: (trackId: number) => void;
  startPlayback: () => void;
}

function TrackControls({
  trackId,
  selectedTrackId,
  isPlaybackRunning,
  selectTrack,
  updateVelocity,
  updatePanning,
  toggleMuted,
  toggleSolo,
  deleteTrack,
  rename,
  updateTrackPart,
  startPlayback,
}: Props) {
  const [showOptions, setShowOptions] = useState(false);

  const track = useStore((state) => state.tracks.byId[trackId]);
  const { name, muted, solo, velocity, panning } = track;

  return (
    <div className="track-controls">
      {selectedTrackId !== trackId ? (
        <span
          className="title"
          onMouseDown={() => setShowOptions(!showOptions)}
        >
          {name}
        </span>
      ) : (
        <input
          className="title-input"
          type="text"
          onChange={(e) => rename(trackId, e.target.value)}
        />
      )}
      <button
        className={`mute-unmute ${muted ? "muted" : ""}`}
        onClick={() => {
          toggleMuted(trackId);
          if (isPlaybackRunning) startPlayback();
        }}
      />
      <button
        className={`solo-button ${solo ? "solo" : ""}`}
        onClick={() => {
          toggleSolo(trackId);
          if (isPlaybackRunning) startPlayback();
        }}
      >
        solo
      </button>
      <Knob
        value={panning}
        onValueChange={(newValue) => {
          updatePanning(trackId, newValue);
          updateTrackPart(trackId);
        }}
        mode="pan"
      />
      <Knob
        value={velocity}
        onValueChange={(newValue) => {
          updateVelocity(trackId, newValue);
          updateTrackPart(trackId);
        }}
        mode="velocity"
      />
      {showOptions && (
        <div className="track-options">
          <button
            onClick={() => {
              setShowOptions(false);
              selectTrack(trackId);
            }}
          >
            rename
          </button>
          <button
            onClick={() => {
              setShowOptions(false);
              deleteTrack(trackId);
            }}
          >
            delete
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(TrackControls);
