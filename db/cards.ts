import { db } from "./client";
import type { Card, CardColor, NewCard } from "./types";

/**
 * Create a new card
 */
export async function createCard(card: NewCard): Promise<Card> {
  const result = await db.runAsync(
    `INSERT INTO cards (user_id, name, bank_name, last4, credit_limit, cut_off_day, payment_day, color)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      card.user_id,
      card.name,
      card.bank_name,
      card.last4,
      card.credit_limit,
      card.cut_off_day,
      card.payment_day,
      card.color,
    ]
  );

  return (await getCardById(result.lastInsertRowId as number))!;
}

/**
 * Get all active cards for a specific user
 */
export async function getAllCards(userId?: number): Promise<Card[]> {
  if (!userId) return [];
  const rows = await db.getAllAsync(
    `SELECT * FROM cards WHERE is_active = 1 AND user_id = ? ORDER BY created_at DESC`,
    [userId]
  ) as Record<string, unknown>[];
  
  return rows.map(mapRowToCard);
}

/**
 * Get a single card by ID
 */
export async function getCardById(id: number): Promise<Card | null> {
  const row = await db.getFirstAsync(
    `SELECT * FROM cards WHERE id = ? AND is_active = 1`,
    [id]
  ) as Record<string, unknown> | null;

  return row ? mapRowToCard(row) : null;
}

/**
 * Update a card
 */
export async function updateCard(id: number, updates: Partial<NewCard>): Promise<Card | null> {
  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (updates.name !== undefined) {
    fields.push("name = ?");
    values.push(updates.name);
  }
  if (updates.bank_name !== undefined) {
    fields.push("bank_name = ?");
    values.push(updates.bank_name);
  }
  if (updates.last4 !== undefined) {
    fields.push("last4 = ?");
    values.push(updates.last4);
  }
  if (updates.credit_limit !== undefined) {
    fields.push("credit_limit = ?");
    values.push(updates.credit_limit);
  }
  if (updates.cut_off_day !== undefined) {
    fields.push("cut_off_day = ?");
    values.push(updates.cut_off_day);
  }
  if (updates.payment_day !== undefined) {
    fields.push("payment_day = ?");
    values.push(updates.payment_day);
  }
  if (updates.color !== undefined) {
    fields.push("color = ?");
    values.push(updates.color);
  }

  if (fields.length === 0) {
    return await getCardById(id);
  }

  values.push(id);
  await db.runAsync(
    `UPDATE cards SET ${fields.join(", ")} WHERE id = ?`,
    values
  );

  return await getCardById(id);
}

/**
 * Soft delete a card (mark as inactive)
 */
export async function deleteCard(id: number): Promise<boolean> {
  const result = await db.runAsync(
    `UPDATE cards SET is_active = 0 WHERE id = ?`,
    [id]
  );

  return result.changes > 0;
}

/**
 * Get card count for a user
 */
export async function getCardCount(userId?: number): Promise<number> {
  if (!userId) return 0;
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM cards WHERE is_active = 1 AND user_id = ?`,
    [userId]
  );
  return result?.count ?? 0;
}

// Helper to map DB row to Card type (handle boolean conversion)
function mapRowToCard(row: Record<string, unknown>): Card {
  return {
    id: row.id as number,
    name: row.name as string,
    bank_name: row.bank_name as string,
    last4: row.last4 as string,
    credit_limit: row.credit_limit as number,
    cut_off_day: row.cut_off_day as number,
    payment_day: row.payment_day as number,
    color: row.color as CardColor,
    is_active: Boolean(row.is_active),
    created_at: row.created_at as string,
  };
}
