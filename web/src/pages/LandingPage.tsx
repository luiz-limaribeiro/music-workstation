import Navbar from "../components/ui/Navbar";
import Playback from "../components/ui/Playback";
import SongCard from "../components/ui/SongCard";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <main className="landing-page">
      <h1>
        Music <br />
        Workstation
      </h1>
      <p>Create music in the browser</p>
      <section className="featured-songs">
        <h3>featured songs</h3>
        <ul>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <li key={i}>
              <SongCard />
            </li>
          ))}
        </ul>
      </section>
      <div className="call">
        <button>start exploring</button>
      </div>
      <Playback />
      <Navbar />
    </main>
  );
}
