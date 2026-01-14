import { db } from "./client";
import type { CardColor, PaymentWithDetails } from "./types";

/**
 * Get upcoming payments within the next N days for a user
 */
export async function getUpcomingPayments(userId?: number, days: number = 7): Promise<PaymentWithDetails[]> {
  if (!userId) return [];
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  const rows = await db.getAllAsync(
    `SELECT 
      ip.id,
      ip.purchase_id,
      ip.installment_number,
      ip.amount,
      ip.due_date,
      ip.is_paid,
      ip.paid_at,
      p.store,
      p.description,
      p.installments as total_installments,
      c.name as card_name,
      c.last4 as card_last4,
      c.color as card_color
     FROM installment_payments ip
     JOIN purchases p ON ip.purchase_id = p.id
     JOIN cards c ON p.card_id = c.id
     WHERE ip.user_id = ?
       AND ip.is_paid = 0
       AND p.is_active = 1
       AND c.is_active = 1
       AND date(ip.due_date) >= date(?)
       AND date(ip.due_date) <= date(?)
     ORDER BY ip.due_date ASC`,
    [userId, today.toISOString().split("T")[0], futureDate.toISOString().split("T")[0]]
  ) as Record<string, unknown>[];

  return rows.map(mapRowToPaymentWithDetails);
}

/**
 * Get all payments for a user (with optional filter)
 */
export async function getAllPayments(userId?: number, filter?: "pending" | "paid" | "overdue"): Promise<PaymentWithDetails[]> {
  if (!userId) return [];
  const today = new Date().toISOString().split("T")[0];
  
  let whereClause = "ip.user_id = ? AND p.is_active = 1 AND c.is_active = 1";
  
  if (filter === "pending") {
    whereClause += ` AND ip.is_paid = 0 AND date(ip.due_date) >= date('${today}')`;
  } else if (filter === "paid") {
    whereClause += " AND ip.is_paid = 1";
  } else if (filter === "overdue") {
    whereClause += ` AND ip.is_paid = 0 AND date(ip.due_date) < date('${today}')`;
  }

  const rows = await db.getAllAsync(
    `SELECT 
      ip.id,
      ip.purchase_id,
      ip.installment_number,
      ip.amount,
      ip.due_date,
      ip.is_paid,
      ip.paid_at,
      p.store,
      p.description,
      p.installments as total_installments,
      c.name as card_name,
      c.last4 as card_last4,
      c.color as card_color
     FROM installment_payments ip
     JOIN purchases p ON ip.purchase_id = p.id
     JOIN cards c ON p.card_id = c.id
     WHERE ${whereClause}
     ORDER BY ip.due_date ASC`,
    [userId]
  ) as Record<string, unknown>[];

  return rows.map(mapRowToPaymentWithDetails);
}

/**
 * Mark a payment as paid
 */
export async function markPaymentAsPaid(paymentId: number): Promise<boolean> {
  const now = new Date().toISOString();
  const result = await db.runAsync(
    `UPDATE installment_payments SET is_paid = 1, paid_at = ? WHERE id = ?`,
    [now, paymentId]
  );

  return result.changes > 0;
}

/**
 * Mark a payment as unpaid (undo)
 */
export async function markPaymentAsUnpaid(paymentId: number): Promise<boolean> {
  const result = await db.runAsync(
    `UPDATE installment_payments SET is_paid = 0, paid_at = NULL WHERE id = ?`,
    [paymentId]
  );

  return result.changes > 0;
}

/**
 * Get total amount due this month for a user
 */
export async function getMonthlyTotal(userId?: number): Promise<number> {
  if (!userId) return 0;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const result = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(ip.amount), 0) as total
     FROM installment_payments ip
     JOIN purchases p ON ip.purchase_id = p.id
     JOIN cards c ON p.card_id = c.id
     WHERE ip.user_id = ?
       AND p.is_active = 1
       AND c.is_active = 1
       AND date(ip.due_date) >= date(?)
       AND date(ip.due_date) <= date(?)`,
    [userId, startOfMonth.toISOString().split("T")[0], endOfMonth.toISOString().split("T")[0]]
  );

  return result?.total ?? 0;
}

/**
 * Get count of pending payments for a user
 */
export async function getPendingPaymentCount(userId?: number): Promise<number> {
  if (!userId) return 0;
  const today = new Date().toISOString().split("T")[0];
  
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count
     FROM installment_payments ip
     JOIN purchases p ON ip.purchase_id = p.id
     JOIN cards c ON p.card_id = c.id
     WHERE ip.user_id = ?
       AND ip.is_paid = 0
       AND p.is_active = 1
       AND c.is_active = 1
       AND date(ip.due_date) >= date(?)`,
    [userId, today]
  );

  return result?.count ?? 0;
}

/**
 * Get count of overdue payments for a user
 */
export async function getOverduePaymentCount(userId?: number): Promise<number> {
  if (!userId) return 0;
  const today = new Date().toISOString().split("T")[0];
  
  const result = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count
     FROM installment_payments ip
     JOIN purchases p ON ip.purchase_id = p.id
     JOIN cards c ON p.card_id = c.id
     WHERE ip.user_id = ?
       AND ip.is_paid = 0
       AND p.is_active = 1
       AND c.is_active = 1
       AND date(ip.due_date) < date(?)`,
    [userId, today]
  );

  return result?.count ?? 0;
}

// Helper to map DB row to PaymentWithDetails type
function mapRowToPaymentWithDetails(row: Record<string, unknown>): PaymentWithDetails {
  return {
    id: row.id as number,
    purchase_id: row.purchase_id as number,
    installment_number: row.installment_number as number,
    amount: row.amount as number,
    due_date: row.due_date as string,
    is_paid: Boolean(row.is_paid),
    paid_at: row.paid_at as string | null,
    store: row.store as string,
    description: row.description as string,
    card_name: row.card_name as string,
    card_last4: row.card_last4 as string,
    card_color: row.card_color as CardColor,
    total_installments: row.total_installments as number,
  };
}
