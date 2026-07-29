/**
 * Format number into Indian Rupee
 */
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

/**
 * Format date
 */
export const formatDate = (
  date: string | Date | null
): string => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Calculate new paid amount
 */
export const calculateNewPaid = (
  currentPaid: number,
  paymentAmount: number
): number => {
  return currentPaid + paymentAmount;
};

/**
 * Calculate remaining amount
 */
export const calculateRemaining = (
  finalFee: number,
  paidAmount: number
): number => {
  return Math.max(finalFee - paidAmount, 0);
};

/**
 * Financial Status
 */
export const calculateFinancialStatus = (
  finalFee: number,
  paidAmount: number
): "Pending" | "Partial" | "Paid" => {

  if (paidAmount <= 0) {
    return "Pending";
  }

  if (paidAmount >= finalFee) {
    return "Paid";
  }

  return "Partial";
};

/**
 * Add months to validity
 */
export const calculateValidity = (
  currentValidTill: string | Date | null,
  months: number
): Date => {

  const baseDate = currentValidTill
    ? new Date(currentValidTill)
    : new Date();

  const newDate = new Date(baseDate);

  newDate.setMonth(newDate.getMonth() + months);

  return newDate;
};

/**
 * Validity Status
 */
export const calculateValidityStatus = (
  validTill: string | Date | null
): "Active" | "Due" | "Overdue" => {

  if (!validTill) return "Due";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validity = new Date(validTill);
  validity.setHours(0, 0, 0, 0);

  if (validity < today) {
    return "Overdue";
  }

  return "Active";
};