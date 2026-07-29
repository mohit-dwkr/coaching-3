
export interface CourseData {
  id: string;
  course_name: string;
}

export interface FeeStructure {
  id: string;
  course_id: string;

  total_fee: number;
  admission_fee: number;
  registration_fee: number;

  duration_months: number;

  status: "active" | "inactive";

  created_at?: string;
  updated_at?: string;

  course?: CourseData;

  // Future Ready
  assigned_students?: number;
}

export interface StudentFeeData {
  id: string;

  student_id: number;
  course_id: string;
  fee_structure_id: string | null;

  total_fee: number;
  discount: number;
  final_fee: number;

  paid_amount: number;
  remaining_amount: number;

  course_fee: number;

  admission_fee: number;

  registration_fee: number;

  duration_months: number;

  next_due_date: string | null;
  admission_date: string | null;

  status: "Pending" | "Partial" | "Paid" | "Overdue";

  created_at?: string;
  updated_at?: string;

  // Relations
  student?: {
    id: number;
    student_id: string;

    name: string;
    email?: string;
    mobile?: string;
    class?: string;

    batch_id?: string;
    course_id?: string;

    batch?: {
      id: string;
      batch_name: string;
      course_id: string;
    };
  };
  course?: {
    id: string;
    course_name: string;
  };

  fee_structure?: FeeStructure;
}

export interface FeeStats {
  totalStructures: number;
  totalAssignedStudents: number;

  totalCollected: number;
  totalPending: number;

  totalOutstanding: number;
}


export type PaymentMode =
  | "Cash"
  | "UPI"
  | "Card"
  | "Bank Transfer"
  | "Cheque";

export interface PaymentHistory {
  id: string;

  student_fee_id: string;
  student_id: number;

  amount: number;

  payment_mode: PaymentMode;

  transaction_date: string;

  transaction_id: string | null;

  receipt_no: string;

  remark: string | null;

  received_by: string;

  months_covered: number;

  valid_from: string;

  valid_until: string;

  is_manual_override: boolean;

  created_at?: string;
}

export interface FeeTransaction {
  id: string;

  student_fee_id: string;
  student_id: number;

  amount: number;

  payment_mode: string;

  transaction_date: string;

  transaction_id?: string | null;

  receipt_no?: string | null;

  remark?: string | null;

  received_by?: string | null;

  created_at: string;

  months_covered: number;

  valid_from?: string | null;

  valid_until?: string | null;

  is_manual_override: boolean;
}


export interface ReceiptData {

  coachingName: string;

  receiptNo: string;

  paymentDate: string;

  studentName: string;

  studentId: string;

  course: string;

  batch: string;

  amount: number;

  paymentMode: string;

  receivedBy: string;

  referenceNo?: string;

  validFrom?: string;

  validUntil?: string;

  remarks?: string;

  totalFee: number;

  paidBefore: number;

  totalPaid: number;

  remainingFee: number;

  status: string;

}


import { Dispatch, SetStateAction } from "react";

export interface PaymentFormData {
  amount: string;
  paymentDate: Date;

  paymentMode: PaymentMode;

  monthsCovered: number;
  referenceNo: string;
  remarks: string;
}

export interface PaymentFormProps {
  formData: PaymentFormData;
  setFormData: Dispatch<
    SetStateAction<PaymentFormData>
  >;
}

export interface StudentWithFee {
  student: any;
  fee: StudentFeeData | null;
}

export interface FooterActionsProps {
  loading?: boolean;
  onClose: () => void;
  onSubmit: () => void;
}