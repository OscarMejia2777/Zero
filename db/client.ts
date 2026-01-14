import * as SQLite from "expo-sqlite";

export let db: SQLite.SQLiteDatabase;

// Initialize database - must be called at app startup
export async function initDatabase() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("zero.db");
  }
  // Enable foreign keys
  await db.execAsync("PRAGMA foreign_keys = ON;");
}
