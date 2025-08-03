import { useState } from "react";
import Knob from "../../common/Knob";
import { useStore } from "../../store/store";
import Clip from "./Clip";
import "./Track.css";
import type { TrackData } from "./trackData";

interface Props {
  track: TrackData;
  totalSteps: number;
}

export default function Track({ track, totalSteps }: Props) {
  const setVelocity = useStore((state) => state.setTrackVelocity);
  const setPanning = useStore((state) => state.setTrackPanning);
  const toggleMuted = useStore((state) => state.toggleTrackMuted);
  const toggleSolo = useStore((state) => state.toggleTrackSolo);

  const [showOptions, setShowOptions] = useState(false);

  const { name, id, panning, velocity, muted, solo, clips } = track

  return (
    <div className="track">
      <span className="title" onMouseDown={() => setShowOptions(!showOptions)}>
        {name}
      </span>
      <button
        className={`mute-unmute ${muted ? "muted" : ""}`}
        onClick={() => toggleMuted(id)}
      />
      <button
        className={`solo-button ${solo ? "solo" : ""}`}
        onClick={() => toggleSolo(id)}
      >
        solo
      </button>
      <Knob
        value={panning}
        onValueChange={(newValue) => setPanning(id, newValue)}
        mode="pan"
      />
      <Knob
        value={velocity}
        onValueChange={(newValue) => setVelocity(id, newValue)}
        mode="velocity"
      />
      <div
        className="clips"
        style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}
      >
        {clips.map((clip) => (
          <Clip key={clip.id} trackId={id} trackName={name} clipData={clip} />
        ))}
      </div>
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
