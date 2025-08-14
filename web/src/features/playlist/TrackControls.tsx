import { useState } from "react";
import Knob from "../../common/Knob";
import "./styles/TrackControls.css";
import React from "react";
import { useStore } from "../../store/store";

interface Props {
  trackId: number;
}

function TrackControls({ trackId }: Props) {
  const [showOptions, setShowOptions] = useState(false);

  const track = useStore((state) => state.tracks.byId[trackId]);
  const { name, muted, solo, velocity, panning } = track;

  const setVelocity = useStore((state) => state.setTrackVelocity);
  const setPanning = useStore((state) => state.setTrackPanning);
  const toggleMuted = useStore((state) => state.toggleTrackMuted);
  const toggleSolo = useStore((state) => state.toggleTrackSolo);

  return (
    <div className="track-controls">
      <span className="title" onMouseDown={() => setShowOptions(!showOptions)}>
        {name}
      </span>
      <button
        className={`mute-unmute ${muted ? "muted" : ""}`}
        onClick={() => toggleMuted(trackId)}
      />
      <button
        className={`solo-button ${solo ? "solo" : ""}`}
        onClick={() => toggleSolo(trackId)}
      >
        solo
      </button>
      <Knob
        value={panning}
        onValueChange={(newValue) => setPanning(trackId, newValue)}
        mode="pan"
      />
      <Knob
        value={velocity}
        onValueChange={(newValue) => setVelocity(trackId, newValue)}
        mode="velocity"
      />
      {showOptions && (
        <div className="track-options">
          <button>rename</button>
          <button>clear</button>
          <button>delete</button>
        </div>
      )}
    </div>
  );
}

export default React.memo(TrackControls);
