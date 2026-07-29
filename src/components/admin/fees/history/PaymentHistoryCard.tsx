import { PaymentHistory } from "../types";
import {
  Calendar,
  CreditCard,
  Receipt,
  User,
  FileText,
  Clock,
} from "lucide-react";

import { Printer } from "lucide-react";

interface PaymentHistoryCardProps {
  payment: PaymentHistory;
  onPrint?: (payment: PaymentHistory) => void;
}

export default function PaymentHistoryCard({
  payment,
  onPrint,
}: PaymentHistoryCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <p className="text-lg font-bold text-green-600">
            ₹{payment.amount.toLocaleString("en-IN")}
          </p>

          <p className="text-xs text-slate-500">
            Payment Received
          </p>
        </div>

        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium">
          {payment.payment_mode}
        </span>

      </div>

      {/* Details */}

      <div className="space-y-3">

        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Receipt className="h-4 w-4" />
          <span>{payment.receipt_no}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Calendar className="h-4 w-4" />
          <span>
            {new Date(
              payment.transaction_date
            ).toLocaleDateString("en-IN")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-700">
          <User className="h-4 w-4" />
          <span>{payment.received_by}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Clock className="h-4 w-4" />
          <span>
            {new Date(
              payment.valid_from
            ).toLocaleDateString("en-IN")}

            {"  →  "}

            {new Date(
              payment.valid_until
            ).toLocaleDateString("en-IN")}
          </span>
        </div>

        {payment.transaction_id && (
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <CreditCard className="h-4 w-4" />
            <span>{payment.transaction_id}</span>
          </div>
        )}

        <div className="flex items-start gap-2 text-sm text-slate-700">
          <FileText className="h-4 w-4 mt-0.5" />

          <span>
            {payment.remark || "No remarks"}
          </span>
        </div>

      </div>


      <hr className="border-slate-200" />

      <div className="flex justify-end">
        <button
          onClick={() => onPrint?.(payment)}
          className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100 transition"
        >
          <Printer className="h-4 w-4" />
          Print Receipt
        </button>
      </div>


    </div>
  );
}