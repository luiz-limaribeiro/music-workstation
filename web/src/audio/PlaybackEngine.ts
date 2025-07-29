import * as Tone from 'tone';
import { useStore } from '../store/store';

const drumTracks = useStore.getState().drumTracks;
const setCurrentStep = useStore.getState().setCurrentStep;

class PlaybackEngine {
  private sequence: Tone.Sequence | null = null;

  constructor() {
    this.initializeSequence();
  }

  private initializeSequence() {
    this.sequence = new Tone.Sequence(
      (time, col) => {
        drumTracks.forEach((track) => {
          if (track.pattern[col].active) {
            track.play(
              time,
              track.velocity,
              track.pattern[col].velocity,
              track.pattern[col].repeatValue
            );
          }
        });
        setCurrentStep(col);
      },
      Array.from({ length: 16 }, (_, i) => i),
      '16n'
    );
  }

  public start() {
    this.sequence?.start();
  }

  public stop() {
    this.sequence?.stop();
  }

  public dispose() {
    this.sequence?.dispose();
    this.sequence = null;
  }
}