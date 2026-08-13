import { supabase } from "@/supabaseClient";
import {
  StudentFeeData,
  PaymentFormData,
} from "../types";

export interface CollectPaymentRequest {
  studentFee: StudentFeeData;
  formData: PaymentFormData;
  receivedBy: string;
}

export interface CollectPaymentResponse {
  success: boolean;
  message: string;
  receiptNo?: string;
}

/**
 * Converts a Date object into local YYYY-MM-DD.
 * Safe for PostgreSQL DATE fields.
 */
function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Adds months while safely handling month-end dates.
 *
 * Example:
 * Jan 31 + 1 month -> Feb 28/29
 * instead of accidentally overflowing into March.
 */
function addMonthsSafe(date: Date, months: number): Date {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const targetMonth = month + months;

  const lastDayOfTargetMonth = new Date(
    year,
    targetMonth + 1,
    0
  ).getDate();

  return new Date(
    year,
    targetMonth,
    Math.min(day, lastDayOfTargetMonth)
  );
}

export async function collectPayment(
  request: CollectPaymentRequest
): Promise<CollectPaymentResponse> {
  try {
    const {
      studentFee,
      formData,
      receivedBy,
    } = request;

    // --------------------------------------------------
    // PAYMENT AMOUNT
    // --------------------------------------------------

    const paymentAmount = Number(formData.amount);

    if (
      !Number.isFinite(paymentAmount) ||
      paymentAmount <= 0
    ) {
      return {
        success: false,
        message: "Please enter a valid payment amount.",
      };
    }

    // --------------------------------------------------
    // MONTHS COVERED
    // --------------------------------------------------

    const monthsCovered = Number(
      formData.monthsCovered
    );

    if (
      !Number.isInteger(monthsCovered) ||
      monthsCovered <= 0
    ) {
      return {
        success: false,
        message: "Please select a valid number of months.",
      };
    }

    // --------------------------------------------------
    // FEE PERIOD
    // --------------------------------------------------
    if (!formData.feePeriodFrom) {
      return {
        success: false,
        message: "Please select a fee period start date.",
      };
    }

    const feePeriodFrom = new Date(formData.feePeriodFrom);

    if (
      Number.isNaN(
        feePeriodFrom.getTime()
      )
    ) {
      return {
        success: false,
        message: "Invalid fee period start date.",
      };
    }

    const feePeriodTo = addMonthsSafe(
      feePeriodFrom,
      monthsCovered
    );

    // --------------------------------------------------
    // DATE STRINGS
    // --------------------------------------------------

    const transactionDate = formatDateOnly(
      formData.paymentDate
    );

    const feePeriodFromDate =
      formatDateOnly(feePeriodFrom);

    const feePeriodToDate =
      formatDateOnly(feePeriodTo);

    // --------------------------------------------------
    // CALL DATABASE RPC
    // --------------------------------------------------

    const { data, error } =
      await supabase.rpc(
        "collect_student_payment",
        {
          p_student_fee_id:
            studentFee.id,

          p_student_id:
            studentFee.student_id,

          p_amount:
            paymentAmount,

          p_payment_mode:
            formData.paymentMode,

          p_transaction_date:
            transactionDate,

          p_transaction_id:
            formData.referenceNo?.trim() || null,

          p_remark:
            formData.remarks?.trim() || null,

          p_received_by:
            receivedBy?.trim() || null,

          p_months_covered:
            monthsCovered,

          p_fee_period_from:
            feePeriodFromDate,

          p_fee_period_to:
            feePeriodToDate,
        }
      );

    // --------------------------------------------------
    // RPC ERROR
    // --------------------------------------------------

    if (error) {
      console.error(
        "collect_student_payment RPC error:",
        error
      );

      return {
        success: false,
        message: error.message,
      };
    }

    // --------------------------------------------------
    // SUCCESS
    // --------------------------------------------------

    return {
      success: true,
      message:
        "Payment collected successfully.",
      receiptNo:
        typeof data === "string"
          ? data
          : undefined,
    };

  } catch (error) {
    console.error(
      "Unexpected payment collection error:",
      error
    );

    return {
      success: false,
      message:
        "Something went wrong while collecting payment.",
    };
  }
}