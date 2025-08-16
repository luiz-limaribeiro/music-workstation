import * as Tone from 'tone'
import { type AppState } from '../store/store';

interface PlaybackEvent {
  time: number | string;
  player: (time: number, velocity: number, repeatValue: number) => void;
  velocity: number;
}

function createPlaybackPart(allEvents: PlaybackEvent[]): Tone.Part<PlaybackEvent> {
  //const stepCount = useStore(state => state.stepCount)

  const playbackPart = new Tone.Part((time, value) => {
    value.player(time, value.velocity, 1);
  }, allEvents)

  playbackPart.loop = false
  playbackPart.loopEnd = '4m'
  return playbackPart
}

function getAllEvents(state: AppState) {
  const events: PlaybackEvent[] = [];
  const trackIds = state.tracks.allIds
  const trackClips = state.trackClips
  const clips = state.clips
  const clipSequencers = state.clipSequencerTracks
  const sequencerTracks = state.sequencerTracks
  const sequencerSteps = state.sequencerTrackSteps
  const steps = state.steps

  trackIds.forEach(trackId => {
    trackClips[trackId].forEach(clipId => {
      const clip = clips.byId[clipId]

      clipSequencers[clipId].forEach(sequencerTrackId => {
        const sequencerTrack = sequencerTracks.byId[sequencerTrackId]

        sequencerSteps[sequencerTrackId].forEach((stepId, index) => {
          const step = steps.byId[stepId]

          if (step.active) {
            const totalSteps = clip.startStep + index
            const time = Tone.Time(`0:0:${totalSteps}`);
            const player = sequencerTrack.player

            events.push({
              time: time.toSeconds(),
              player: player,
              velocity: step.velocity
            })
          }
        })
      })
    })
  })

  return events
}

export function setupPlayback(state: AppState) {
  const transport = state.transport
  transport.cancel(0)

  const allEvents = getAllEvents(state);
  const playbackPart = createPlaybackPart(allEvents);
  console.log("Events scheduled:", playbackPart)

  Tone.start()
  playbackPart.start(0);
}