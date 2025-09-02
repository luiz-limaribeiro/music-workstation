import * as Tone from 'tone';

export type TrackData = {
  id: number;
  name: string;
  volumeNode: Tone.Volume;
  pannerNode: Tone.Panner;
  velocity: number;
  panning: number;
  muted: boolean;
  solo: boolean;
};

let nextId = 0;

export function getNextTrackId() {
  return ++nextId;
}

export function newTrackData(name: string) {
  const volume = new Tone.Volume(0).toDestination();
  const panner = new Tone.Panner(0).connect(volume);

  return {
    id: ++nextId,
    name,
    volumeNode: volume,
    pannerNode: panner,
    velocity: 1,
    panning: 0,
    muted: false,
    solo: false,
  };
}
