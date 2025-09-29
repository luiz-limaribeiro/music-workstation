import { useEffect, useState } from "react";
import "./styles/ProjectSelector.css";
import { listAllProjects } from "../../data/pianoRollDB";
import usePianoRollStore from "../../store/pianoRollStore";
import { type ProjectMetaList } from "../../data/projectMeta";
import { useShallow } from "zustand/shallow";

export default function ProjectSelector() {
  const [active, setActive] = useState(false);
  const [projects, setProjects] = useState<ProjectMetaList>([]);
  const [newName, setNewName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectToOpenSettings, setProjectToOpenSettings] = useState("");
  const [projectToRename, setProjectToRename] = useState("");
  const [rename, setRename] = useState("");

  const projectSaved = usePianoRollStore((s) => s.projectSaved);
  const activeProjectId = usePianoRollStore((s) => s.activeProjectId);
  const { loadStateFromDB, saveProjectToDB, deleteProjectInDB, renameProject } =
    usePianoRollStore(
      useShallow((s) => ({
        loadStateFromDB: s.pianoRollActions.loadStateFromDB,
        saveProjectToDB: s.pianoRollActions.saveProjectToDB,
        deleteProjectInDB: s.pianoRollActions.deleteProjectInDB,
        renameProject: s.pianoRollActions.renameProject,
      }))
    );

  useEffect(() => {
    listAllProjects().then((projects) => {
      if (projects.length === 0) {
        setActive(true);
      }

      loadStateFromDB(projects[0].id);
      setProjectName(projects[0].name);
      setProjects(projects);
    });
  }, []);

  async function createProject() {
    if (!newName.trim()) return;
    const id = crypto.randomUUID();
    await saveProjectToDB(id, newName);
    await loadStateFromDB(id);
    setActive(false);
    setProjects(await listAllProjects());
    setProjectName(newName);
    setNewName("");
  }

  async function handleProjectClick(id: string) {
    await loadStateFromDB(id);
    clearState();
    const project = projects.find((p) => p.id === id);
    if (project) setProjectName(project.name);
  }

  async function handleDelete(id: string) {
    await deleteProjectInDB(id);
    listAllProjects().then(setProjects);
  }

  async function handleRename(id: string, name: string) {
    await renameProject(id, name);
    await listAllProjects().then(setProjects)
    setProjectName(name)
  }

  function clearState() {
    setActive(false);
    setProjectToRename("");
    setProjectToOpenSettings("");
    setNewName("");
    setRename("");
  }

  return (
    <div>
      {active ? (
        <div
          className="project-selector-container"
          onClick={() => {
            if (activeProjectId) clearState();
          }}
        >
          <div
            className="project-selector"
            onClick={(e) => {
              e.stopPropagation();
              setProjectToOpenSettings("");
              setProjectToRename("");
            }}
          >
            <h2>Projects</h2>
            <ul className="projects">
              {projects.map((project) => (
                <li key={project.id} onClick={() => handleProjectClick(project.id)}>
                  {projectToRename === project.id ? (
                    <input
                      type="text"
                      value={rename}
                      onChange={(e) => {
                        setRename(e.target.value);
                        handleRename(project.id, e.target.value)
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span>{project.name}</span>
                  )}

                  {projectToOpenSettings === project.id ? (
                    <div
                      className="settings"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          setProjectToRename(project.id);
                          setProjectToOpenSettings("");
                          setRename(project.name);
                        }}
                      >
                        Rename
                      </button>
                      <button onClick={() => handleDelete(project.id)}>
                        Delete
                      </button>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <button
                    className="settings-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setProjectToOpenSettings(project.id);
                    }}
                  >
                    ⋮
                  </button>
                </li>
              ))}
            </ul>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New project name"
            />
            <button onClick={createProject} disabled={newName.length === 0}>
              Create
            </button>
          </div>
        </div>
      ) : (
        <h4 className="project-name" onClick={() => setActive(true)}>
          {projectName}
          {projectSaved === false ? "*" : ""}
        </h4>
      )}
    </div>
  );
}
