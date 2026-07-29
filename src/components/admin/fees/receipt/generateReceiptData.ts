import {
  PaymentHistory,
  ReceiptData,
  StudentFeeData,
} from "../types";

export function generateReceiptData(
  payment: PaymentHistory,
  studentFee: StudentFeeData
): ReceiptData {

  const totalPaid = studentFee.paid_amount;

  const paidBefore =
    Math.max(
      totalPaid - payment.amount,
      0
    );

  return {

    coachingName: "Toppers Academy",

    receiptNo:
      payment.receipt_no,

    paymentDate:
      payment.transaction_date,

    studentName:
      studentFee.student?.name || "-",

    studentId:
      studentFee.student?.student_id || "-",

    course:
      studentFee.course?.course_name || "-",

    batch:
      studentFee.student?.batch?.batch_name || "-",

    amount:
      payment.amount,

    paymentMode:
      payment.payment_mode,

    receivedBy:
      payment.received_by,

    referenceNo:
      payment.transaction_id || "",

    validFrom:
      payment.valid_from,

    validUntil:
      payment.valid_until,

    remarks:
      payment.remark || "",

    totalFee:
      studentFee.final_fee,

    paidBefore,

    totalPaid,

    remainingFee:
      studentFee.remaining_amount,

    status:
      studentFee.status,

  };

}