// Database exports
export {
    deleteSession, getCurrentUser, getSession, hashPassword, registerUser, saveSession, validateUser
} from "./auth";
export { db, initDatabase } from "./client";
export { migrate } from "./migrate";

// Types
export { CARD_COLORS } from "./types";
export type {
    Card,
    CardColor, InstallmentPayment, NewCard,
    NewPurchase, PaymentWithDetails, Purchase,
    User
} from "./types";

// Card operations
export {
    createCard, deleteCard, getAllCards,
    getCardById, getCardCount, updateCard
} from "./cards";

// Purchase operations
export {
    createPurchase, deletePurchase,
    getActivePurchaseCount, getAllPurchases,
    getInstallmentsByPurchase, getPurchaseById,
    getPurchasesByCard
} from "./purchases";

// Payment operations
export {
    getAllPayments, getMonthlyTotal, getOverduePaymentCount, getPendingPaymentCount, getUpcomingPayments, markPaymentAsPaid,
    markPaymentAsUnpaid
} from "./payments";

