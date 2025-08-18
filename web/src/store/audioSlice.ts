import * as Tone from "tone";
import type { StateCreator } from "zustand";
import type { AppState } from "./store";
import type { TransportClass } from "tone/build/esm/core/clock/Transport";
import { type PlaybackEvent } from "../data/playbackEvent";

export interface AudioSlice {
  isTransportRunning: boolean;
  transport: TransportClass;
  bpm: number;
  currentPosition: string;
  positionListenerId: string;
  audioActions: {
    startPlayback: () => void;
    stopPlayback: () => void;
    setBpm: (bpm: number) => void;
    setCurrentPosition: (position: string) => void;
  };
}

export const createAudioSlice: StateCreator<AppState, [], [], AudioSlice> = (
  set
) => ({
  isTransportRunning: false,
  transport: Tone.getTransport(),
  bpm: 120,
  currentPosition: "0:0:0",
  positionListenerId: "",
  audioActions: {
    startPlayback: () =>
      set((state) => {
        const transport = state.transport;
        const totalSteps = state.stepCount;

        transport.cancel(0);
        transport.loop = true;
        transport.loopEnd = `${Math.floor(totalSteps / 16)}m`

        const allEvents = getAllEvents(state);
        const playbackPart = createPlaybackPart(allEvents);

        Tone.start();
        playbackPart.start(0);

        transport.start();

        return { isTransportRunning: true };
      }),
    stopPlayback: () =>
      set((state) => {
        state.transport.stop();
        state.transport.position = 0;

        return {
          isTransportRunning: false,
          currentPosition: "0:0:0",
        };
      }),
    setBpm: (bpm) => set({ bpm }),
    setCurrentPosition: (position: string) =>
      set({ currentPosition: position }),
  },
});

function createPlaybackPart(
  allEvents: PlaybackEvent[]
): Tone.Part<PlaybackEvent> {
  const playbackPart = new Tone.Part((time, value) => {
    value.player(time, value.velocity, 1);
  }, allEvents);

  playbackPart.loop = false;

  return playbackPart;
}

function getAllEvents(state: AppState) {
  const events: PlaybackEvent[] = [];
  const trackIds = state.tracks.allIds;
  const trackClips = state.trackClips;
  const clips = state.clips;
  const clipSequencers = state.clipSequencerTracks;
  const sequencerTracks = state.sequencerTracks;
  const sequencerSteps = state.sequencerTrackSteps;
  const steps = state.steps;

  trackIds.forEach((trackId) => {
    trackClips[trackId].forEach((clipId) => {
      const clip = clips.byId[clipId];

      clipSequencers[clipId].forEach((sequencerTrackId) => {
        const sequencerTrack = sequencerTracks.byId[sequencerTrackId];

        sequencerSteps[sequencerTrackId].forEach((stepId, index) => {
          const step = steps.byId[stepId];

          if (step.active) {
            const totalSteps = clip.startStep + index;
            const time = Tone.Time(`0:0:${totalSteps}`);
            const player = sequencerTrack.player;

            events.push({
              time: time.toSeconds(),
              player: player,
              velocity: step.velocity,
            });
          }
        });
      });
    });
  });

  return events;
}
