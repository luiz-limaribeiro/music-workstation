import React from "react";
import Track from "./Track";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/shallow";

interface Props {
  trackId: number;
  totalSteps: number;
}

function TrackContainer({ trackId, totalSteps }: Props) {
  const { track, clipIds } = useStore(
    useShallow((state) => ({
      track: state.tracks.byId[trackId],
      clipIds: state.trackClips[trackId],
    }))
  );

  const {
    setTrackVelocity,
    setTrackPanning,
    toggleTrackMuted,
    toggleTrackSolo,
  } = useStore(
    useShallow((state) => ({
      setTrackVelocity: state.setTrackVelocity,
      setTrackPanning: state.setTrackPanning,
      toggleTrackMuted: state.toggleTrackMuted,
      toggleTrackSolo: state.toggleTrackSolo,
    }))
  );

  return (
    <Track
      track={track}
      clipIds={clipIds}
      totalSteps={totalSteps}
      setVelocity={setTrackVelocity}
      setPanning={setTrackPanning}
      toggleMuted={toggleTrackMuted}
      toggleSolo={toggleTrackSolo}
    />
  );
}

export default React.memo(TrackContainer);
