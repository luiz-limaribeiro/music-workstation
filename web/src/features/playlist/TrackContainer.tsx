import React from "react";
import Track from "./Track";
import { useStore } from "../../store/store";
import { useShallow } from "zustand/shallow";

interface Props {
  trackId: number;
  totalSteps: number;
}

function TrackContainer({ trackId, totalSteps }: Props) {
  const { track, clipIds, newClipGhost } = useStore(
    useShallow((state) => ({
      track: state.tracks.byId[trackId],
      clipIds: state.trackClips[trackId],
      newClipGhost: state.newClipGhost,
    }))
  );

  const {
    setTrackVelocity,
    setTrackPanning,
    toggleTrackMuted,
    toggleTrackSolo,
    addClip,
    showAddClipButton,
  } = useStore(
    useShallow((state) => ({
      setTrackVelocity: state.setTrackVelocity,
      setTrackPanning: state.setTrackPanning,
      toggleTrackMuted: state.toggleTrackMuted,
      toggleTrackSolo: state.toggleTrackSolo,
      addClip: state.addClip,
      showAddClipButton: state.showNewClipButton,
      hideAddClipButton: state.hideNewClipButton,
    }))
  );

  return (
    <Track
      track={track}
      clipIds={clipIds}
      totalSteps={totalSteps}
      newClipGhost={newClipGhost}
      setVelocity={setTrackVelocity}
      setPanning={setTrackPanning}
      toggleMuted={toggleTrackMuted}
      toggleSolo={toggleTrackSolo}
      addClip={addClip}
      showAddClipButton={showAddClipButton}
    />
  );
}

export default React.memo(TrackContainer);
