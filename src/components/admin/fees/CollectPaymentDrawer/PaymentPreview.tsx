import { Calculator } from "lucide-react";
import { StudentFeeData, PaymentFormData } from "../types";

interface PaymentPreviewProps {
  studentFee: StudentFeeData | null;
  formData: PaymentFormData;
}

/**
 * Adds months safely while keeping the date valid.
 *
 * Example:
 * Jan 31 + 1 month = Feb 28/29
 * instead of overflowing into March.
 */
function addMonthsSafe(
  date: Date,
  months: number
): Date {
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

export default function PaymentPreview({
  studentFee,
  formData,
}: PaymentPreviewProps) {
  if (!studentFee) return null;

  // --------------------------------------------------
  // PAYMENT CALCULATION
  // --------------------------------------------------

  const payment =
    Number(formData.amount) || 0;

  const newPaid =
    studentFee.paid_amount + payment;

  const newRemaining = Math.max(
    studentFee.final_fee - newPaid,
    0
  );

  // --------------------------------------------------
  // FORMATTERS
  // --------------------------------------------------

  const formatCurrency = (
    amount: number
  ) =>
    `₹${amount.toLocaleString("en-IN")}`;

  const formatDate = (
    date: string | Date | null
  ) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // --------------------------------------------------
  // FEE PERIOD
  // --------------------------------------------------

  const feePeriodFrom =
    formData.feePeriodFrom || null;

  const feePeriodTo =
    feePeriodFrom
      ? addMonthsSafe(
          new Date(feePeriodFrom),
          formData.monthsCovered
        )
      : null;

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-4 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">

      {/* Section Title Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/60">

        <div className="flex items-center gap-2">

          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Calculator className="h-4 w-4" />
          </div>

          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Payment Preview
          </h3>

        </div>

        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">
          Calculated Live
        </span>

      </div>


      {/* Calculation Breakdown Area */}
      <div className="space-y-3.5 pt-1">

        {/* ================================================= */}
        {/* SECTION 1: PAID BREAKDOWN */}
        {/* ================================================= */}

        <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 space-y-2">

          <div className="flex justify-between items-center text-sm">

            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Current Paid
            </span>

            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatCurrency(
                studentFee.paid_amount
              )}
            </span>

          </div>


          <div className="flex justify-between items-center text-sm">

            <span className="text-slate-500 dark:text-slate-400 font-medium">
              New Payment
            </span>

            <span className="font-bold text-blue-600 dark:text-blue-400">
              + {formatCurrency(payment)}
            </span>

          </div>


          <div className="flex justify-between items-center border-t border-slate-200/60 dark:border-slate-800 pt-2 text-xs">

            <span className="font-bold text-slate-900 dark:text-slate-100">
              New Total Paid
            </span>

            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
              {formatCurrency(newPaid)}
            </span>

          </div>

        </div>


        {/* ================================================= */}
        {/* SECTION 2: REMAINING BALANCE */}
        {/* ================================================= */}

        <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 space-y-2">

          <div className="flex justify-between items-center text-xs">

            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Current Remaining
            </span>

            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatCurrency(
                studentFee.remaining_amount
              )}
            </span>

          </div>


          <div className="flex justify-between items-center border-t border-slate-200/60 dark:border-slate-800 pt-2 text-xs">

            <span className="font-bold text-slate-900 dark:text-slate-100">
              New Remaining Balance
            </span>

            <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
              {formatCurrency(newRemaining)}
            </span>

          </div>

        </div>


        {/* ================================================= */}
        {/* SECTION 3: FEE PERIOD */}
        {/* ================================================= */}

        <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800 space-y-2">

          <div className="flex justify-between items-center text-xs">

            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Fee Period From
            </span>

            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatDate(feePeriodFrom)}
            </span>

          </div>


          <div className="flex justify-between items-center text-xs">

            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Fee Period To
            </span>

            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {formatDate(feePeriodTo)}
            </span>

          </div>


          <div className="flex justify-between items-center border-t border-slate-200/60 dark:border-slate-800 pt-2 text-xs">

            <span className="font-bold text-slate-900 dark:text-slate-100">
              Next Due Date
            </span>

            <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
              {formatDate(feePeriodTo)}
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}