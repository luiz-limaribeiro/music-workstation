import { play, stop } from './playback'
import './styles/Transport.css'

export default function Transport() {
  return (
    <div className="transport">
      <button onClick={play}>start</button>
      <button onClick={stop}>stop</button>
      <span>BPM: 120</span>
      <span>0:00</span>
    </div>
  )
}