import { useEffect, useRef } from "react";
import "./Playlist.css";
import Timeline from "./Timeline";
import { useStore } from "../../store/store";
import Transport from "./Transport";
import Track from "./Track";
import { newClipData } from "./clipData";
import { newTrackData } from "./trackData";

const stepsPerBar = 16;
const bars = 4;
const totalSteps = (stepsPerBar * bars) * 2;

export default function Playlist() {
  const isInitialized = useRef(false)

  const tracks = useStore((state) => state.tracks)
  const addTrack = useStore((state) => state.addTrack)
  const addClip = useStore((state) => state.addClip);

  useEffect(() => {
    if (isInitialized.current) return

    addTrack({ id: 1, name: "Track 1", panning: 0, velocity: 1, muted: false, solo: false, clips: [] });
    addTrack({ id: 2, name: "Track 2", panning: 0, velocity: 1, muted: false, solo: false, clips: [] });
    addClip(1, newClipData(0, 16));
    addClip(2, newClipData(16, 16));
    isInitialized.current = true
  }, [addTrack, addClip]);

  function handleAddTrack() {
    const newTrack = newTrackData('Track ' + Math.random().toFixed(2))
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
