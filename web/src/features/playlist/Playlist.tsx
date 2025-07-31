import { useEffect } from "react";
import "./Playlist.css";
import Timeline from "./Timeline";
import { useStore } from "../../store/store";
import type { TrackData } from "./trackData";
import Transport from "./Transport";
import Track from "./Track";

const stepsPerBar = 16;
const bars = 4;
const totalSteps = stepsPerBar * bars;

let trackCount = 2;

export default function Playlist() {
  const tracks = useStore((state) => state.tracks)
  const addTrack = useStore((state) => state.addTrack)
  const addClip = useStore((state) => state.addClip);

  useEffect(() => {
    addTrack({ id: 1, name: "Track 1", panning: 0, velocity: 1, mute: false, solo: false })
    addTrack({ id: 2, name: "Track 2", panning: 0, velocity: 1, mute: false, solo: false })
    addClip({
      id: 1,
      trackId: 1,
      startStep: 0,
      length: 4,
      pattern: Array(16).fill({ active: false, velocity: 1, repeatValue: 1 }),
    });
    addClip({
      id: 2,
      trackId: 2,
      startStep: 4,
      length: 8,
      pattern: Array(16).fill({ active: false, velocity: 1, repeatValue: 1 }),
    });
  }, []);

  function handleAddTrack() {
    trackCount += 1;
    const newTrack: TrackData = {
      id: trackCount,
      name: `Track ${trackCount}`,
      panning: 0,
      velocity: 1,
      mute: false,
      solo: false,
    };
    addTrack(newTrack)
  }

  return (
    <main className="playlist">
      <Timeline totalSteps={totalSteps} />

      <div className="tracks">
        {tracks.map((track) => (
          <Track key={track.id} track={track} totalSteps={totalSteps} />
        ))}
        <button className="add-track" onClick={handleAddTrack}>
          add track
        </button>
      </div>

      <Transport />
    </main>
  );
}
