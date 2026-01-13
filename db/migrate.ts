import { db } from "./client";

/**
 * Run all database migrations
 * Call this at app startup after initDatabase()
 */
export async function migrate() {
  console.log("[DB] Starting migrations...");
  
  // Create tables using execAsync for speed and stability
  try {
    // We combine basic table creation into a single transaction-like block
    await db.execAsync(`
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        name TEXT NOT NULL,
        bank_name TEXT NOT NULL,
        last4 TEXT NOT NULL CHECK(length(last4) = 4),
        credit_limit REAL NOT NULL DEFAULT 0,
        cut_off_day INTEGER NOT NULL CHECK(cut_off_day >= 1 AND cut_off_day <= 31),
        payment_day INTEGER NOT NULL CHECK(payment_day >= 1 AND payment_day <= 31),
        color TEXT NOT NULL DEFAULT 'blue',
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        card_id INTEGER NOT NULL,
        store TEXT NOT NULL,
        description TEXT NOT NULL,
        total_amount REAL NOT NULL,
        installments INTEGER NOT NULL CHECK(installments > 0),
        start_date TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS installment_payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        purchase_id INTEGER NOT NULL,
        installment_number INTEGER NOT NULL,
        amount REAL NOT NULL,
        due_date TEXT NOT NULL,
        is_paid INTEGER NOT NULL DEFAULT 0,
        paid_at TEXT,
        FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
        UNIQUE(purchase_id, installment_number)
      );
    `);
    console.log("[DB] Core tables ensured");
  } catch (error) {
    console.error("[DB] Error during base migration:", error);
  }

  // Column migrations (ALTER TABLE doesn't support IF NOT EXISTS for columns)
  const tables = ["cards", "purchases", "installment_payments"];
  for (const table of tables) {
    try {
      await db.execAsync(`ALTER TABLE ${table} ADD COLUMN user_id INTEGER REFERENCES users(id);`);
      console.log(`[DB] Added user_id to ${table}`);
    } catch {
      // Ignore if column already exists
    }
  }

  // Indexes - One by one
  const indexes = [
    "CREATE INDEX IF NOT EXISTS idx_payments_due_date ON installment_payments(due_date)",
    "CREATE INDEX IF NOT EXISTS idx_payments_is_paid ON installment_payments(is_paid)",
    "CREATE INDEX IF NOT EXISTS idx_purchases_card_id ON purchases(card_id)",
    "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)",
    "CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id)",
    "CREATE INDEX IF NOT EXISTS idx_payments_user_id ON installment_payments(user_id)"
  ];

  for (const idx of indexes) {
    try {
      await db.execAsync(idx);
    } catch {
      // Ignore index errors on web
    }
  }

  console.log("[DB] Migrations completed");
}
