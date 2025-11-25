import Navbar from "../components/ui/Navbar";
import Playback from "../components/ui/Playback";
import SongCard from "../components/ui/SongCard";
import './LandingPage.css'

export default function LandingPage() {
  return (
    <main className="landing-page">
      <h1>Music Workstation</h1>
      <p>Create music in the browser</p>
      <SongCard />
      <Playback />
      <Navbar />
    </main>
  );
}
