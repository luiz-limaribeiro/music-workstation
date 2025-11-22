import ProjectSelector from "./ProjectSelector";
import "./styles/TopBar.css";
import TopBarTransport from "./TopBarTransport";

export default function TopBar() {
  

  return (
    <div className="top-bar">
      <ProjectSelector />
      <TopBarTransport />
      
      <span className={`material-symbols-outlined icon settings`}>
        settings
      </span>
    </div>
  );
}
