import { useEffect, useRef } from "react";
import "./Playlist.css";
import Timeline from "./Timeline";
import { useStore } from "../../store/store";
import Transport from "./Transport";
import { newClipData } from "../../models/clipData";
import { newTrackData } from "../../models/trackData";
import TrackContainer from "./TrackContainer";

const stepsPerBar = 16;
const bars = 4;
const totalSteps = stepsPerBar * bars * 4;

export default function Playlist() {
  const isInitialized = useRef(false);

  const tracks = useStore((state) => state.tracks.allIds);
  const addTrack = useStore((state) => state.addTrack);
  const addClip = useStore((state) => state.addClip);
  const hideAddClipButton = useStore((state) => state.hideNewClipButton);

  useEffect(() => {
    const handleGlobalMouseDown = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        if (!e.target.closest(".clips")) {
          hideAddClipButton();
        }
      }
    };
    document.addEventListener("mousedown", handleGlobalMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleGlobalMouseDown);
    };
  }, [hideAddClipButton]);

  useEffect(() => {
    if (isInitialized.current) return;

    addTrack({
      id: -1,
      name: "Track 1",
      panning: 0,
      velocity: 1,
      muted: false,
      solo: false,
    });
    addTrack({
      id: -2,
      name: "Track 2",
      panning: 0,
      velocity: 1,
      muted: false,
      solo: false,
    });
    addClip(-1, newClipData(0, 16));
    addClip(-2, newClipData(16, 16));
    isInitialized.current = true;
  }, [addTrack, addClip]);

  function handleAddTrack() {
    const newTrack = newTrackData("Track " + Math.random().toFixed(2));
    addTrack(newTrack);
  }

  return (
    <main className="playlist">
      <Timeline totalSteps={totalSteps} />

      <div className="tracks">
        {tracks.map((id) => (
          <TrackContainer key={id} trackId={id} totalSteps={totalSteps} />
        ))}
        <button className="add-track" onClick={handleAddTrack}>
          add track
        </button>
      </div>

      <Transport />
    </main>
  );
}
