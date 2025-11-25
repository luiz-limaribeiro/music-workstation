import './Playback.css'

export default function Playback() {
  return (
    <div className='playback'>
      <div className='texts'>
        <h4>Song title</h4>
        <span>User name</span>
      </div>
      <div className='icons'>
        <button className='material-symbols-rounded'>edit</button>
        <button className='material-symbols-rounded favorite'>favorite</button>
        <button className='material-symbols-rounded play'>play_arrow</button>
      </div>
    </div>
  )
}