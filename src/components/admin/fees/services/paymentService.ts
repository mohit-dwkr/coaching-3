import { supabase } from "@/supabaseClient";
import { StudentFeeData, PaymentFormData } from "../types";

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

export async function collectPayment(
  request: CollectPaymentRequest
): Promise<CollectPaymentResponse> {
  try {
    const { studentFee, formData, receivedBy } = request;

    const paymentAmount = Number(formData.amount);

    const newPaidAmount =
      studentFee.paid_amount + paymentAmount;

    const newRemainingAmount = Math.max(
      studentFee.final_fee - newPaidAmount,
      0
    );

    const newStatus =
      newRemainingAmount === 0
        ? "Paid"
        : newPaidAmount > 0
          ? "Partial"
          : "Pending";

    // Generate Receipt Number


    // Validity
    const validFrom = formData.paymentDate;

    const validUntil = new Date(formData.paymentDate);
    validUntil.setMonth(
      validUntil.getMonth() + formData.monthsCovered
    );

    // Call RPC
    const { data, error } = await supabase.rpc(
      "collect_student_payment",
      {
        p_student_fee_id: studentFee.id,
        p_student_id: studentFee.student_id,

        p_amount: paymentAmount,

        p_payment_mode: formData.paymentMode,

        p_transaction_date: formData.paymentDate
          .toISOString()
          .split("T")[0],

        p_transaction_id:
          formData.referenceNo || null,

        p_remark:
          formData.remarks || null,

        p_received_by: receivedBy,

        p_months_covered: formData.monthsCovered,

        p_valid_from: validFrom
          .toISOString()
          .split("T")[0],

        p_valid_until: validUntil
          .toISOString()
          .split("T")[0],

        p_new_paid_amount: newPaidAmount,

        p_new_remaining_amount: newRemainingAmount,

        p_new_status: newStatus,

        p_next_due_date: validUntil
          .toISOString()
          .split("T")[0],
      }
    );

    if (error) {
      console.error(error);

      return {
        success: false,
        message: error.message,
      };
    }

    return {
      success: true,
      message: "Payment collected successfully.",
      receiptNo: data,
    };

  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Something went wrong while collecting payment.",
    };
  }
}