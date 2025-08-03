import "./Sequencer.css";
import TrackRow from "./TrackRow";
import { useStore } from "../../store/store";
import { useEffect, useReducer } from "react";
import { sequencerReducer } from "./sequencerReducer";

export default function Sequencer() {
  const trackIndex = useStore((state) => state.selectedTrackIndex);
  const clipIndex = useStore((state) => state.selectedClipIndex);
  const tracks = useStore((state) => state.tracks);

  const setShowSequencer = useStore((state) => state.setShowSequencer);
  const unselectClip = useStore((state) => state.unselectClip);
  const updateSequencerTracks = useStore(state => state.updateSequencerTracks)

  const sequencerTracks = tracks[trackIndex].clips[clipIndex].sequencerTracks;
  const [seqTracks, dispatch] = useReducer(sequencerReducer, sequencerTracks);

  useEffect(() => {
    updateSequencerTracks(seqTracks)
  }, [seqTracks, updateSequencerTracks])

  function handleDone() {
    unselectClip()
    setShowSequencer(false);
  }

  return (
    <div className="sequencer-container">
      <div className="sequencer">
        <div className="sequencer-header">
          <h3>{tracks[trackIndex].name}</h3>
          <button onClick={handleDone}>done</button>
        </div>
        {seqTracks.map((track) => (
          <TrackRow key={track.id} sequencerTrack={track} dispatch={dispatch} />
        ))}
        <div className="add-instrument">
          <button onClick={() => dispatch({ type: "ADD_TRACK" })}>
            add track
          </button>
        </div>
      </div>
    </div>
  );
}
