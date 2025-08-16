import { useEffect } from "react";
import "./styles/Playlist.css";
import { useStore } from "../../store/store";
import Transport from "./Transport";
import { newTrackData } from "../../data/trackData";
import TracksContainer from "./TracksContainer";

const STEPS_PER_BAR = 16;
const BARS = 80;
const TOTAL_STEPS = STEPS_PER_BAR * BARS;

export default function Playlist() {
  const trackIds = useStore((state) => state.tracks.allIds);
  const addTrack = useStore((state) => state.addTrack);
  const hideAddClipButton = useStore((state) => state.hideNewClipButton);
  const selectClip = useStore((state) => state.selectClip);

  useEffect(() => {
    const handleGlobalMouseDown = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        if (!e.target.closest(".clips")) hideAddClipButton();
        if (!e.target.closest(".clip")) selectClip(-1);
      }
    };
    document.addEventListener("mousedown", handleGlobalMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleGlobalMouseDown);
    };
  }, [hideAddClipButton, selectClip]);

  function handleAddTrack() {
    const newTrack = newTrackData("Track " + (trackIds.length + 1));
    addTrack(newTrack);
  }

  return (
    <main className="playlist">
      <div className="tracks">
        <TracksContainer totalSteps={TOTAL_STEPS} />
        <button className="add-track" onClick={handleAddTrack}>
          add track
        </button>
      </div>

      <Transport />
    </main>
  );
}
