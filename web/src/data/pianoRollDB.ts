import { openDB } from "idb";
import type { PianoRollStore } from "../store/pianoRollStore";
import type { ProjectMetaList } from "./projectMeta";

const DB_NAME = "piano";
const VERSION = 2;

export function getDB() {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("projects")) {
        db.createObjectStore("projects");
      }
      if (!db.objectStoreNames.contains("metadata")) {
        db.createObjectStore("metadata", { keyPath: "id" });
      }
    },
  });
}

export async function saveProjectMeta(projectId: string, projectName: string) {
  const db = await getDB();
  const now = Date.now();

  await db.put(
    "metadata",
    {
      id: projectId,
      name: projectName,
      createdAt: now,
      updatedAt: now,
    }
  );
}

export async function clearProjectMeta(projectId: string) {
  const db = await getDB()
  await db.delete("metadata", projectId)
  await db.delete("projects", projectId)
}

export async function renameProject(projectId: string, newName: string) {
  const db = await getDB()
  const existingMeta = await db.get("metadata", projectId);

  await db.put(
    "metadata",
    {
      id: projectId,
      name: newName,
      createdAt: existingMeta.createdAt,
      updatedAt: Date.now()
    }
  )
}

export async function savePianoRollState(
  projectId: string,
  state: Partial<PianoRollStore>
) {
  const db = await getDB();
  await db.put("projects", state, projectId);

  const existingMeta = await db.get("metadata", projectId);
  const now = Date.now();

  await db.put(
    "metadata",
    {
      id: projectId,
      name: existingMeta?.name || projectId,
      createdAt: existingMeta?.createdAt || now,
      updatedAt: now,
    }
  );
}

export async function loadPianoRollState(
  projectId: string
): Promise<Partial<PianoRollStore> | null> {
  const db = await getDB();
  const state = await db.get("projects", projectId);
  return state || null;
}

export async function clearPianoRollState(projectId: string) {
  const db = await getDB();
  await db.delete("projects", projectId);
}

export async function listAllProjects(): Promise<ProjectMetaList> {
  const db = await getDB();
  const keys = await db.getAll("metadata");
  return keys;
}
