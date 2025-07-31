import * as Tone from "tone";
import { useStore } from "../store/store";

export class PlaybackEngine {
  private sequence: Tone.Sequence | null = null;

  init(patternLength: number) {
    this.sequence = new Tone.Sequence(
      (time, col) => {
        const drumTracks = useStore.getState().drumTracks;
        drumTracks.forEach((track) => {
          if (track.pattern[col].active)
            track.play(
              time,
              track.velocity,
              track.pattern[col].velocity,
              track.pattern[col].repeatValue
            );
        });
        useStore.getState().setCurrentStep(col);
      },
      Array.from({ length: patternLength }, (_, i) => i),
      "16n"
    );
  }

  setCallback() {
    if (!this.sequence) return;
    this.sequence.callback = (time, col) => {
      const drumTracks = useStore.getState().drumTracks;
      drumTracks.forEach((track) => {
        if (!track.muted && track.pattern[col].active)
          track.play(
            time,
            track.velocity,
            track.pattern[col].velocity,
            track.pattern[col].repeatValue
          );
      });
      useStore.getState().setCurrentStep(col);
    };
  }

  async start() {
    if (Tone.getContext().state !== "running")
      await Tone.start();

    Tone.getTransport().start();
    this.sequence?.start();
  }

  public stop() {
    Tone.getTransport().stop();
    this.sequence?.stop();
    useStore.getState().setCurrentStep(0);
  }

  public dispose() {
    this.sequence?.dispose();
    this.sequence = null;
  }
}
