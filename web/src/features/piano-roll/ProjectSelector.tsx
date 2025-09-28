import { useEffect, useRef, useState } from "react";
import "./styles/ProjectSelector.css";
import { listAllProjects } from "../../data/pianoRollDB";
import usePianoRollStore from "../../store/pianoRollStore";
import { type ProjectMeta, type ProjectMetaList } from "../../data/projectMeta";

export default function ProjectSelector() {
  const [active, setActive] = useState(false);
  const [projects, setProjects] = useState<ProjectMetaList>([]);
  const [newName, setNewName] = useState("");
  const loadStateFromDB = usePianoRollStore(
    (s) => s.pianoRollActions.loadStateFromDB
  );
  const saveProjectToDB = usePianoRollStore(
    s => s.pianoRollActions.saveProjectToDB
  )

  useEffect(() => {
    listAllProjects().then(projects => {
      if (projects.length === 0)
        saveProjectToDB(crypto.randomUUID(), "New project")
      else
        loadStateFromDB(projects[0].id)

      setProjects(projects)
    });
  }, []);

  async function createProject() {
    if (!newName.trim()) return;
    await saveProjectToDB(crypto.randomUUID(), newName)
    setActive(false);
    setProjects(await listAllProjects());
  }

  return (
    <div>
      {active ? (
        <div className="project-selector-container" onClick={() => setActive(false)}>
          <div className="project-selector" onClick={(e) => e.stopPropagation()}>
            <h2>Projects</h2>

            <div className="sections">
              <div>
                <h4>load</h4>
                <select
                  onChange={async (e) => {
                    const id = e.target.value;
                    if (id) {
                      await loadStateFromDB(id);
                      setActive(false);
                    }
                  }}
                >
                  <option value="">-- Select Project--</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="new-section">
                <h4>new</h4>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New project name"
                />
                <button onClick={createProject}>Create</button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button className="projects-icon" onClick={() => setActive(true)}>
          Projects
        </button>
      )}
    </div>
  );
}
