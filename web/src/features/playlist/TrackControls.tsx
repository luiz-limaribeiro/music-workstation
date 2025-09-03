import Knob from "../../common/Knob";
import "./styles/TrackControls.css";
import React from "react";
import { useStore } from "../../store/store";

interface Props {
  trackId: number;
  selectedTrackId: number;
  trackToRenameId: number;
  isPlaybackRunning: boolean;
  selectTrack: (trackId: number) => void;
  selectTrackToRename: (trackId: number) => void;
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
  trackToRenameId,
  selectedTrackId,
  isPlaybackRunning,
  selectTrack,
  selectTrackToRename,
  updateVelocity,
  updatePanning,
  toggleMuted,
  toggleSolo,
  deleteTrack,
  rename,
  updateTrackPart,
  startPlayback,
}: Props) {
  const track = useStore((state) => state.tracks.byId[trackId]);
  const { name, muted, solo, velocity, panning } = track;

  return (
    <div className="track-controls">
      {trackToRenameId !== trackId ? (
        <span className="title" onMouseDown={() => selectTrack(trackId)}>
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
      {selectedTrackId === trackId && (
        <div className="track-options">
          <button
            onClick={() => {
              selectTrack(-1);
              selectTrackToRename(trackId);
            }}
          >
            rename
          </button>
          <button
            onClick={() => {
              selectTrack(-1);
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
