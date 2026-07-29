import { supabase } from "@/supabaseClient";
import { PaymentHistory } from "../types";

export async function getStudentPaymentHistory(
  studentFeeId: string
): Promise<PaymentHistory[]> {
  try {
    const { data, error } = await supabase
      .from("Coaching-3_FeeTransactions")
      .select("*")
      .eq("student_fee_id", studentFeeId)
      .order("transaction_date", { ascending: false });

    if (error) {
      console.error("Failed to load payment history:", error);
      return [];
    }

    return (data ?? []) as PaymentHistory[];
  } catch (error) {
    console.error("Unexpected error while loading payment history:", error);
    return [];
  }
}