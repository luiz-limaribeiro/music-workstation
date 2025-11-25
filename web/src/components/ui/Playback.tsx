import './Playback.css'

export default function Playback() {
  return (
    <div className='playback'>
      <div className='texts'>
        <h4>Song title</h4>
        <span>User name</span>
      </div>
      <div className='icons'>
        <button className='material-symbols-rounded icon'>edit</button>
        <button className='material-symbols-rounded icon favorite'>favorite</button>
        <button className='material-symbols-rounded icon play'>play_arrow</button>
      </div>
    </div>
  )
}