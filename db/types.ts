/**
 * Database types for Zero app
 */

// Card colors available for selection
export type CardColor = "green" | "purple" | "blue" | "red" | "orange" | "pink" | "cyan" | "gold";

export const CARD_COLORS: { value: CardColor; label: string; hex: string }[] = [
  { value: "green", label: "Verde", hex: "#40FFC5" },
  { value: "purple", label: "Morado", hex: "#C878FF" },
  { value: "blue", label: "Azul", hex: "#50A0FF" },
  { value: "red", label: "Rojo", hex: "#FF5A5A" },
  { value: "orange", label: "Naranja", hex: "#FF9F43" },
  { value: "pink", label: "Rosa", hex: "#FF6B9D" },
  { value: "cyan", label: "Cyan", hex: "#00D9FF" },
  { value: "gold", label: "Dorado", hex: "#FFD700" },
];

// Card entity
export interface Card {
  id: number;
  name: string;           // User-defined card name (e.g., "Mi Visa Gold")
  bank_name: string;      // Bank name (e.g., "Chase", "BBVA")
  last4: string;          // Last 4 digits
  credit_limit: number;   // Credit limit in currency
  cut_off_day: number;    // Day of month (1-31) when billing cycle ends
  payment_day: number;    // Day of month (1-31) when payment is due
  color: CardColor;       // User-selected color
  is_active: boolean;     // Whether card is active
  created_at: string;     // ISO date string
}

// Purchase/Installment plan entity
export interface Purchase {
  id: number;
  card_id: number;        // Foreign key to cards
  store: string;          // Store name (e.g., "Apple Store")
  description: string;    // Item description (e.g., "MacBook Pro")
  total_amount: number;   // Total purchase amount
  installments: number;   // Number of months (e.g., 12)
  start_date: string;     // ISO date when installments start
  is_active: boolean;     // Whether purchase plan is active
  created_at: string;     // ISO date string
}

// Individual installment payment
export interface InstallmentPayment {
  id: number;
  purchase_id: number;    // Foreign key to purchases
  installment_number: number;  // Which payment (1, 2, 3...)
  amount: number;         // Amount due for this installment
  due_date: string;       // ISO date when payment is due
  is_paid: boolean;       // Whether this installment was paid
  paid_at: string | null; // ISO date when paid, null if not paid
}

// Extended payment info for display (with joined data)
export interface PaymentWithDetails extends InstallmentPayment {
  store: string;
  description: string;
  card_name: string;
  card_last4: string;
  card_color: CardColor;
  total_installments: number;
}

// User entity
export interface User {
  id: number;
  email: string;
  password_hash: string;
  full_name: string | null;
  recovery_question: string | null;
  recovery_answer_hash: string | null;
  created_at: string;
}

export const SESSION_KEY = "zero_user_session";

// New card input (for creating)
export type NewCard = Omit<Card, "id" | "created_at" | "is_active"> & { user_id: number };

// New purchase input (for creating)
export type NewPurchase = Omit<Purchase, "id" | "created_at" | "is_active"> & { user_id: number };
