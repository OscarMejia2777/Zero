import { db } from "./client";
import type { InstallmentPayment, NewPurchase, Purchase } from "./types";

/**
 * Create a purchase and automatically generate all installment payments
 */
export async function createPurchase(purchase: NewPurchase): Promise<Purchase> {
  // Insert the purchase
  const result = await db.runAsync(
    `INSERT INTO purchases (user_id, card_id, store, description, total_amount, installments, start_date)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      purchase.user_id,
      purchase.card_id,
      purchase.store,
      purchase.description,
      purchase.total_amount,
      purchase.installments,
      purchase.start_date,
    ]
  );

  const purchaseId = result.lastInsertRowId as number;

  // Generate installment payments
  const monthlyAmount = Math.round((purchase.total_amount / purchase.installments) * 100) / 100;
  const startDate = new Date(purchase.start_date);

  for (let i = 1; i <= purchase.installments; i++) {
    // Calculate due date for this installment
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + (i - 1));
    
    // Adjust amount for last installment to handle rounding
    const amount = i === purchase.installments
      ? Math.round((purchase.total_amount - monthlyAmount * (purchase.installments - 1)) * 100) / 100
      : monthlyAmount;

    await db.runAsync(
      `INSERT INTO installment_payments (user_id, purchase_id, installment_number, amount, due_date)
       VALUES (?, ?, ?, ?, ?)`,
      [purchase.user_id, purchaseId, i, amount, dueDate.toISOString().split("T")[0]]
    );
  }

  return (await getPurchaseById(purchaseId))!;
}

/**
 * Get a purchase by ID
 */
export async function getPurchaseById(id: number): Promise<Purchase | null> {
  const row = await db.getFirstAsync(
    `SELECT * FROM purchases WHERE id = ? AND is_active = 1`,
    [id]
  ) as Record<string, unknown> | null;

  return row ? mapRowToPurchase(row) : null;
}

/**
 * Get all purchases for a specific card
 */
export async function getPurchasesByCard(cardId: number): Promise<Purchase[]> {
  const rows = await db.getAllAsync(
    `SELECT * FROM purchases WHERE card_id = ? AND is_active = 1 ORDER BY created_at DESC`,
    [cardId]
  ) as Record<string, unknown>[];

  return rows.map(mapRowToPurchase);
}

/**
 * Get all active purchases for a user
 */
export async function getAllPurchases(userId?: number): Promise<Purchase[]> {
  if (!userId) return [];
  const rows = await db.getAllAsync(
    `SELECT * FROM purchases WHERE is_active = 1 AND user_id = ? ORDER BY created_at DESC`,
    [userId]
  ) as Record<string, unknown>[];

  return rows.map(mapRowToPurchase);
}

/**
 * Get installments for a purchase
 */
export async function getInstallmentsByPurchase(purchaseId: number): Promise<InstallmentPayment[]> {
  const rows = await db.getAllAsync(
    `SELECT * FROM installment_payments WHERE purchase_id = ? ORDER BY installment_number`,
    [purchaseId]
  ) as Record<string, unknown>[];

  return rows.map(mapRowToInstallment);
}

/**
 * Soft delete a purchase (marks purchase as inactive)
 */
export async function deletePurchase(id: number): Promise<boolean> {
  const result = await db.runAsync(
    `UPDATE purchases SET is_active = 0 WHERE id = ?`,
    [id]
  );

  return result.changes > 0;
}

/**
 * Get count of active purchases for a user
 */
export async function getActivePurchaseCount(userId?: number): Promise<number> {
  if (!userId) return 0;
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM purchases WHERE is_active = 1 AND user_id = ?`,
    [userId]
  );
  return result?.count ?? 0;
}

// Helper to map DB row to Purchase type
function mapRowToPurchase(row: Record<string, unknown>): Purchase {
  return {
    id: row.id as number,
    card_id: row.card_id as number,
    store: row.store as string,
    description: row.description as string,
    total_amount: row.total_amount as number,
    installments: row.installments as number,
    start_date: row.start_date as string,
    is_active: Boolean(row.is_active),
    created_at: row.created_at as string,
  };
}

// Helper to map DB row to InstallmentPayment type
function mapRowToInstallment(row: Record<string, unknown>): InstallmentPayment {
  return {
    id: row.id as number,
    purchase_id: row.purchase_id as number,
    installment_number: row.installment_number as number,
    amount: row.amount as number,
    due_date: row.due_date as string,
    is_paid: Boolean(row.is_paid),
    paid_at: row.paid_at as string | null,
  };
}
