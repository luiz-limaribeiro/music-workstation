import * as Tone from "tone";
import { useEffect, useReducer, useRef, useState } from "react";
import "./Sequencer.css";
import TrackRow from "./TrackRow";
import Controls from "./Controls";
import { newTrackData, type TrackData } from "./trackData";
import { trackReducer } from "./trackReducer";
import { drums } from "./synthPresets";

const initialTracks: TrackData[] = [
  newTrackData("kick", drums.kick),
  newTrackData("snare", drums.snare),
  newTrackData("hihat", drums.hihat),
];

export default function Sequencer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);

  const [tracks, dispatch] = useReducer(trackReducer, initialTracks);

  const sequence = useRef<Tone.Sequence>(null);

  useEffect(() => {
    sequence.current = new Tone.Sequence(
      (time, col) => {
        tracks.forEach((track) => {
          if (track.pattern[col]) track.play(time, track.velocity);
        });
        setCurrentStep(col);
      },
      Array.from({ length: 16 }, (_, i) => i),
      "16n"
    );

    return () => {
      sequence.current?.dispose();
    };
  }, []);

  // sync the sequence with the "pattern" state
  useEffect(() => {
    if (!sequence.current) return;

    // the callback runs for each column at the correct time
    sequence.current.callback = (time, col) => {
      tracks.forEach((track) => {
        if (!track.muted && track.pattern[col]) track.play(time, track.velocity);
      });
      setCurrentStep(col);
    };
  }, [tracks]);

  // sync the Tone bpm with the "bpm" state
  useEffect(() => {
    Tone.getTransport().bpm.value = bpm;
  }, [bpm]);

  function toggleStep(trackId: number, stepId: number) {
    const track = tracks.find((track) => track.id === trackId);
    if (!track) return;

    const newPattern = [...track.pattern];
    newPattern[stepId] = newPattern[stepId] ? 0 : 1;

    dispatch({ type: "UPDATE_PATTERN", id: trackId, pattern: newPattern });
  }

  async function togglePlay() {
    if (Tone.getContext().state !== "running") {
      await Tone.start();
    }

    if (isPlaying) {
      Tone.getTransport().stop();
      setIsPlaying(false);
      setCurrentStep(0);
    } else {
      sequence.current?.start(0);
      Tone.getTransport().start();
      setIsPlaying(true);
    }
  }

  function changeVelocity(trackId: number, velocity: number) {
    dispatch({ type: "SET_VELOCITY", id: trackId, velocity: velocity });
  }

  function onMuteUnmute(trackId: number) {
    dispatch({ type: "TOGGLE_MUTE", id: trackId });
  }

  return (
    <div className="sequencer">
      <Controls
        bpm={bpm}
        isPlaying={isPlaying}
        onChangeBpm={(newBpm) => setBpm(newBpm)}
        onTogglePlay={togglePlay}
      />
      {tracks.map((track, trackIndex) => (
        <TrackRow
          key={trackIndex}
          track={track}
          currentStep={currentStep}
          onToggleStep={toggleStep}
          onChangeVelocity={changeVelocity}
          onMute={onMuteUnmute}
        />
      ))}
    </div>
  );
}
