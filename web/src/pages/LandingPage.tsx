import Footer from "../components/ui/Footer";
import Navbar from "../components/ui/Navbar";
import Playback from "../components/ui/Playback";
import SongCard from "../components/ui/SongCard";
import { tech } from "../data/techStack";
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
      <section className="about-section">
        <h2 className="section-title"><span className="material-symbols-rounded">info</span>About this project</h2>
        <div className="tech-carousel">
          <div className="headline">
            <h3>Tech Stack</h3>
            <a href="#">Learn more</a>
          </div>
          <div className="tech-track">
            {tech.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
            {tech.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>
      </section>
      <Playback />
      <Navbar />
      <Footer />
    </main>
  );
}
