import { IndianRupee, Wallet, Clock3, BadgeCheck } from "lucide-react";
import { StudentFeeData } from "../types";

interface CurrentFeeSummaryProps {
  studentFee: StudentFeeData | null;
}

export default function CurrentFeeSummary({
  studentFee,
}: CurrentFeeSummaryProps) {
  if (!studentFee) return null;

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN")}`;

  const formatDate = (date: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">

      <h3 className="text-base font-semibold text-slate-900">
        Current Fee Summary
      </h3>

      <div className="grid grid-cols-2 gap-4">

        {/* Final Fee */}

        <div className="rounded-lg border bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <IndianRupee className="h-4 w-4" />
            Final Fee
          </div>

          <div className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(studentFee.final_fee)}
          </div>
        </div>

        {/* Paid */}

        <div className="rounded-lg border bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Wallet className="h-4 w-4" />
            Paid Amount
          </div>

          <div className="mt-2 text-xl font-bold text-green-600">
            {formatCurrency(studentFee.paid_amount)}
          </div>
        </div>

        {/* Remaining */}

        <div className="rounded-lg border bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <IndianRupee className="h-4 w-4" />
            Remaining
          </div>

          <div className="mt-2 text-xl font-bold text-red-600">
            {formatCurrency(studentFee.remaining_amount)}
          </div>
        </div>

        {/* Current Validity */}

        <div className="rounded-lg border bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Clock3 className="h-4 w-4" />
            Current Validity
          </div>

          <div className="mt-2 font-semibold text-slate-900">
            {formatDate(studentFee.next_due_date)}
          </div>
        </div>

      </div>

      {/* Financial Status */}

      <div className="rounded-lg border bg-emerald-50 border-emerald-200 p-4 flex items-center justify-between">

        <div>
          <p className="text-xs text-slate-500">
            Financial Status
          </p>

          <h4 className="text-lg font-bold text-slate-900">
            {studentFee.status}
          </h4>
        </div>

        <BadgeCheck className="h-8 w-8 text-emerald-600" />

      </div>

    </div>
  );
}