import * as Tone from "tone";
import type { StateCreator } from "zustand";
import type { AppState } from "./store";
import type { TransportClass } from "tone/build/esm/core/clock/Transport";
import { type PlaybackEvent } from "../data/playbackEvent";

export interface AudioSlice {
  transport: TransportClass;
  isPlaying: boolean;
  bpm: number;
  currentPosition: string;
  partsByTrackId: { [trackId: number]: Tone.Part };
  audioActions: {
    startPlayback: () => void;
    stopPlayback: () => void;
    setBpm: (bpm: number) => void;
    setCurrentPosition: (position: string) => void;
    updateTrackPart: (trackId: number) => void;
  };
}

export const createAudioSlice: StateCreator<AppState, [], [], AudioSlice> = (
  set
) => ({
  transport: Tone.getTransport(),
  isPlaying: false,
  bpm: 120,
  currentPosition: "0:0:0",
  partsByTrackId: {},
  audioActions: {
    startPlayback: () =>
      set((state) => {
        const transport = state.transport;
        const totalSteps = state.stepCount;
        const trackIds = state.tracks.allIds;

        transport.cancel(0);
        for (const id in state.partsByTrackId)
          state.partsByTrackId[id].dispose();

        transport.loop = true;
        transport.loopEnd = `${Math.ceil(totalSteps / 16)}m`;
        transport.position = state.currentPosition;
        transport.set({ bpm: state.bpm });

        const newPartsByTrackId: { [trackId: number]: Tone.Part } = {};
        const tracksToPlay =
          state.soloTrackIds.length > 0 ? state.soloTrackIds : trackIds.filter(id => !state.tracks.byId[id].muted);

        tracksToPlay.forEach((id) => {
          const events = getEventsForTrack(state, id);

          const part = new Tone.Part((time, value) => {
            value.player(time, 1);
          }, events);

          part.start(0);

          newPartsByTrackId[id] = part;
        });

        Tone.start();
        transport.start();

        return {
          isPlaying: true,
          partsByTrackId: newPartsByTrackId,
        };
      }),
    stopPlayback: () =>
      set((state) => {
        state.transport.stop();
        state.transport.position = 0;

        return {
          isPlaying: false,
          currentPosition: "0:0:0",
        };
      }),
    setBpm: (bpm) =>
      set((state) => {
        state.transport.set({ bpm: bpm });
        return { bpm: bpm };
      }),
    setCurrentPosition: (position: string) =>
      set({ currentPosition: position }),
    updateTrackPart: (trackId: number) =>
      set((state) => {
        if (state.transport.state !== "started") return state;

        // 1. Clear any existing events on this part
        if (state.partsByTrackId[trackId])
          state.partsByTrackId[trackId].clear();

        // 2. Get only the events for this track
        const trackEvents = getEventsForTrack(state, trackId);

        // 3. Create a new part or update the existing one
        const newPart = new Tone.Part((time, value) => {
          value.player(time, 1);
        }, trackEvents);

        newPart.start(0);

        // 5. Update the store
        return {
          ...state,
          partsByTrackId: {
            ...state.partsByTrackId,
            [trackId]: newPart,
          },
        };
      }),
  },
});

function getEventsForTrack(state: AppState, trackId: number) {
  const events: PlaybackEvent[] = [];
  const track = state.tracks.byId[trackId];
  const trackClips = state.trackClips;
  const clips = state.clips;
  const trackInstruments = state.trackInstruments;
  const instruments = state.instruments;
  const clipSteps = state.clipSteps;
  const steps = state.steps;

  trackClips[trackId].forEach((clipId) => {
    const clip = clips.byId[clipId];

    trackInstruments[trackId].forEach((instrumentId, i) => {
      const instrument = instruments.byId[instrumentId];
      instrument.sample.connect(track.pannerNode);

      // Each clip is 16 steps long
      clipSteps[clipId].slice(i * 16, i * 16 + 16).forEach((stepId, index) => {
        const step = steps.byId[stepId];

        if (step.active) {
          const totalSteps = clip.startStep + index;
          const time = Tone.Time(`0:0:${totalSteps}`);

          events.push({
            time: time.toSeconds(),
            player: instrument.player,
          });
        }
      });
    });
  });

  return events;
}
