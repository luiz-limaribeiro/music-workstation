import { useEffect, useRef } from "react";
import { useStore } from "../../store/store";
import TrackControls from "./TrackControls";
import TrackTimeline from "./TrackTimeline";
import "./styles/TracksContainer.css";
import Playhead from "./Playhead";
import { useShallow } from "zustand/shallow";

interface Props {
  totalSteps: number;
}

export default function TracksContainer({ totalSteps }: Props) {
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const { trackIds, stepCount, selectedTrackId } = useStore(
    useShallow((state) => ({
      trackIds: state.tracks.allIds,
      stepCount: state.stepCount,
      selectedTrackId: state.selectedTrackId,
    }))
  );

  const {
    selectTrack,
    updateVelocity,
    updatePanning,
    toggleMuted,
    toggleSolo,
    deleteTrack,
    rename,
    updateTrackPart,
  } = useStore(
    useShallow((state) => ({
      selectTrack: state.playlistActions.selectTrack,
      updateVelocity: state.playlistActions.updateVelocity,
      updatePanning: state.playlistActions.updatePanning,
      toggleMuted: state.playlistActions.toggleMuted,
      toggleSolo: state.playlistActions.toggleSolo,
      deleteTrack: state.playlistActions.delete,
      rename: state.playlistActions.rename,
      updateTrackPart: state.audioActions.updateTrackPart,
    }))
  );

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    function onMouseDown(e: MouseEvent) {
      if (e.button === 2 && timeline) {
        e.preventDefault();
        isDragging.current = true;
        startX.current = e.pageX - timeline.offsetLeft;
        scrollLeft.current = timeline.scrollLeft;
        document.body.classList.add("grabbing-cursor");
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDragging.current || !timeline) return;
      const x = e.pageX - timeline.offsetLeft;
      const walk = x - startX.current;
      timeline.scrollLeft = scrollLeft.current - walk;
    }

    function onMouseUp() {
      isDragging.current = false;
      document.body.classList.remove("grabbing-cursor");
    }

    function onMouseLeave() {
      isDragging.current = false;
      document.body.classList.remove("grabbing-cursor");
    }

    function onContextMenu(e: MouseEvent) {
      e.preventDefault();
    }

    timeline.addEventListener("mousedown", onMouseDown);
    timeline.addEventListener("mousemove", onMouseMove);
    timeline.addEventListener("mouseup", onMouseUp);
    timeline.addEventListener("mouseleave", onMouseLeave);
    timeline.addEventListener("contextmenu", onContextMenu);

    return () => {
      timeline.removeEventListener("mousedown", onMouseDown);
      timeline.removeEventListener("mousemove", onMouseMove);
      timeline.removeEventListener("mouseup", onMouseUp);
      timeline.removeEventListener("mouseleave", onMouseLeave);
      timeline.removeEventListener("contextmenu", onContextMenu);
    };
  });

  return (
    <div className="tracks-container">
      <div className="track-controls-container">
        {trackIds.map((id) => (
          <TrackControls
            key={id}
            trackId={id}
            selectedTrackId={selectedTrackId}
            selectTrack={selectTrack}
            updateVelocity={updateVelocity}
            updatePanning={updatePanning}
            toggleMuted={toggleMuted}
            toggleSolo={toggleSolo}
            deleteTrack={deleteTrack}
            rename={rename}
            updateTrackPart={updateTrackPart}
          />
        ))}
      </div>
      <div className="clips-timeline-container" ref={timelineRef}>
        {trackIds.map((id) => (
          <TrackTimeline
            key={id}
            trackId={id}
            totalSteps={totalSteps}
            stepCount={stepCount}
          />
        ))}
        <Playhead />
      </div>
    </div>
  );
}
