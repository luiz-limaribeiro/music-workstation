import { useEffect, useRef } from "react";
import "./styles/Playlist.css";
import { useStore } from "../../store/store";
import Transport from "./Transport";
import { newTrackData } from "../../data/trackData";
import TracksContainer from "./TracksContainer";
import { newClipData } from "../../data/clipData";

const STEPS_PER_BAR = 16;
const BARS = 50;
const TOTAL_STEPS = STEPS_PER_BAR * BARS;

export default function Playlist() {
  const trackIds = useStore((state) => state.tracks.allIds);
  const addTrack = useStore((state) => state.playlistActions.addTrack);
  const hideAddClipButton = useStore((state) => state.clipActions.hideNewClipButton);
  const selectClip = useStore((state) => state.clipActions.selectClip);
  const selectTrack = useStore((state) => state.playlistActions.selectTrack);
  const selectTrackToRename = useStore(state => state.playlistActions.selectTrackToRename)

  const isInitialized = useRef(false)
  const addClip = useStore((state) => state.clipActions.addClip)

  useEffect(() => {
    if (isInitialized.current) return;

    addTrack(newTrackData("Track 1"));
    addTrack(newTrackData("Track 2"));
    addClip(1, newClipData(0, 16));
    addClip(2, newClipData(16, 16));
    isInitialized.current = true
  }, [addTrack, addClip]);

  useEffect(() => {
    const handleGlobalMouseDown = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        if (!e.target.closest(".clips")) hideAddClipButton();
        if (!e.target.closest(".clip")) selectClip(-1);
        if (!e.target.closest(".title-input")) selectTrackToRename(-1);
        if (!e.target.closest(".track-controls")) selectTrack(-1);
      }
    };

    document.addEventListener("mousedown", handleGlobalMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleGlobalMouseDown);
    };
  }, [hideAddClipButton, selectClip, selectTrackToRename, selectTrack]);

  function handleAddTrack() {
    const newTrack = newTrackData("Track " + (trackIds.length + 1));
    addTrack(newTrack);
  }

  return (
    <main className="playlist">
      <div className="tracks">
        <TracksContainer totalSteps={TOTAL_STEPS} />
        <button className="add-track" onClick={handleAddTrack} title="Add Track">➕</button>
      </div>

      <Transport/>
    </main>
  );
}
