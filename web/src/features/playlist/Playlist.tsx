import { useEffect, useRef } from "react";
import "./styles/Playlist.css";
import { useStore } from "../../store/store";
import Transport from "./Transport";
import { newTrackData } from "../../data/trackData";
import TracksContainer from "./TracksContainer";
import { newClipData } from "../../data/clipData";

const STEPS_PER_BAR = 16;
const BARS = 80;
const TOTAL_STEPS = STEPS_PER_BAR * BARS;

export default function Playlist() {
  const trackIds = useStore((state) => state.tracks.allIds);
  const addTrack = useStore((state) => state.playlistActions.addTrack);
  const hideAddClipButton = useStore((state) => state.playlistActions.hideNewClipButton);
  const selectClip = useStore((state) => state.playlistActions.selectClip);
  const selectTrack = useStore(state => state.playlistActions.selectTrack)

  const transport = useStore(state => state.transport)
  const isPlaying = useStore((state) => state.isTransportRunning);
  const startPlayback = useStore((state) => state.audioActions.startPlayback);
  const stopPlayback = useStore((state) => state.audioActions.stopPlayback);
  const setCurrentPosition = useStore((state) => state.audioActions.setCurrentPosition)

  const positionListenerId = useRef(0)

  const isInitialized = useRef(false)
  const addClip = useStore((state) => state.playlistActions.addClip)

  useEffect(() => {
    if (isInitialized.current) return;

    addTrack({
      id: -2,
      name: "Track 1",
      panning: 0,
      velocity: 1,
      muted: false,
      solo: false,
    });
    addTrack({
      id: -3,
      name: "Track 2",
      panning: 0,
      velocity: 1,
      muted: false,
      solo: false,
    });
    addClip(-2, newClipData(0, 16));
    addClip(-3, newClipData(16, 16));
    isInitialized.current = true
  }, [addTrack, addClip]);

  useEffect(() => {
    const handleGlobalMouseDown = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement) {
        if (!e.target.closest(".clips")) hideAddClipButton();
        if (!e.target.closest(".clip")) selectClip(-1);
        if (!e.target.closest(".title-input")) selectTrack(-1);
      }
    };

    document.addEventListener("mousedown", handleGlobalMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleGlobalMouseDown);
    };
  }, [hideAddClipButton, selectClip, selectTrack]);

  useEffect(() => {
    const posListenerId = transport.scheduleRepeat(() => {
      const currentPos = transport.position;
      setCurrentPosition(currentPos.toString());
    }, '16n')

    positionListenerId.current = posListenerId

    return () => {
      transport.clear(positionListenerId.current)
    }
  }, [isPlaying, transport, setCurrentPosition])

  function handleAddTrack() {
    const newTrack = newTrackData("Track " + (trackIds.length + 1));
    addTrack(newTrack);
  }

  function handleStopPlayback() {
    transport.clear(positionListenerId.current)
    stopPlayback()
  }

  return (
    <main className="playlist">
      <div className="tracks">
        <TracksContainer totalSteps={TOTAL_STEPS} />
        <button className="add-track" onClick={handleAddTrack}>
          add track
        </button>
      </div>

      <Transport
        isPlaying={isPlaying}
        startPlayback={startPlayback}
        stopPlayback={handleStopPlayback}
      />
    </main>
  );
}
