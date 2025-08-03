import "./Sequencer.css";
import TrackRow from "./TrackRow";
import { useStore } from "../../store/store";
import { useEffect, useReducer } from "react";
import { sequencerReducer } from "./sequencerReducer";
import type { SequencerTrack } from "./sequencerTrackData";

interface Props {
  trackId: number;
  clipId: number;
  trackName: string;
  sequencerTracks: SequencerTrack[];
  onCloseEditor: () => void;
}

export default function Sequencer({ trackId, clipId,  trackName, sequencerTracks, onCloseEditor }: Props) {
  const updateSequencerTracks = useStore(
    (state) => state.updateSequencerTracks
  );

  const [seqTracks, dispatch] = useReducer(sequencerReducer, sequencerTracks);

  useEffect(() => {
    updateSequencerTracks(trackId, clipId, seqTracks);
  }, [updateSequencerTracks, trackId, clipId, seqTracks]);

  return (
    <div className="sequencer-container">
      <div className="sequencer">
        <div className="sequencer-header">
          <h3>{trackName}</h3>
          <button onClick={onCloseEditor}>done</button>
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
