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

  return (
    <div className="track">
      <span className="title" onMouseDown={() => setShowOptions(!showOptions)}>
        {track.name}
      </span>
      <button
        className={`mute-unmute ${track.muted ? "muted" : ""}`}
        onClick={() => toggleMuted(track.id)}
      />
      <button
        className={`solo-button ${track.solo ? "solo" : ""}`}
        onClick={() => toggleSolo(track.id)}
      >
        solo
      </button>
      <Knob
        value={track.panning}
        onValueChange={(newValue) => setPanning(track.id, newValue)}
        mode="pan"
      />
      <Knob
        value={track.velocity}
        onValueChange={(newValue) => setVelocity(track.id, newValue)}
        mode="velocity"
      />
      <div
        className="clips"
        style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}
      >
        {track.clips.map((clip) => (
          <Clip key={clip.id} trackId={track.id} clipData={clip} />
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
