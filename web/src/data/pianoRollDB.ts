import { openDB } from "idb";
import type { PianoRollStore } from "../store/pianoRollStore";

const DB_NAME = "piano";
const STORE_NAME = "state";
const VERSION = 1;

export function getDB() {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function savePianoRollState(state: Partial<PianoRollStore>) {
  const db = await getDB();
  await db.put(STORE_NAME, state, "pianoRollState");
}

export async function loadPianoRollState(): Promise<Partial<PianoRollStore> | null> {
  const db = await getDB();
  const state = await db.get(STORE_NAME, "pianoRollState");
  return state || null;
}

export async function clearPianoRollState() {
  const db = await getDB();
  await db.delete(STORE_NAME, "pianoRollState");
}
