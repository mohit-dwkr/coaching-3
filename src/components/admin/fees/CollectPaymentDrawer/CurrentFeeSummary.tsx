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
  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-4 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
    
    {/* Section Title Header */}
    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/60">
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Current Fee Summary
      </h3>
      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
        Live Balance
      </span>
    </div>

    {/* Metric Cards Grid */}
    <div className="grid grid-cols-2 gap-3">

      {/* 1. Final Fee */}
      <div className="rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-3.5 space-y-2 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/80">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
          <div className="p-1 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <IndianRupee className="h-3.5 w-3.5" />
          </div>
          Final Fee
        </div>
        <div className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
          {formatCurrency(studentFee.final_fee)}
        </div>
      </div>

      {/* 2. Paid Amount */}
      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 p-3.5 space-y-2 transition-all hover:border-emerald-500/30">
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <div className="p-1 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Wallet className="h-3.5 w-3.5" />
          </div>
          Paid Amount
        </div>
        <div className="text-lg font-black tracking-tight text-emerald-600 dark:text-emerald-400">
          {formatCurrency(studentFee.paid_amount)}
        </div>
      </div>

      {/* 3. Remaining Amount */}
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 dark:bg-rose-500/10 p-3.5 space-y-2 transition-all hover:border-rose-500/30">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs font-semibold">
          <div className="p-1 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400">
            <IndianRupee className="h-3.5 w-3.5" />
          </div>
          Remaining
        </div>
        <div className="text-lg font-black tracking-tight text-rose-600 dark:text-rose-400">
          {formatCurrency(studentFee.remaining_amount)}
        </div>
      </div>

      {/* 4. Current Validity */}
      <div className="rounded-xl border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-3.5 space-y-2 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/80">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold">
          <div className="p-1 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Clock3 className="h-3.5 w-3.5" />
          </div>
          Validity Date
        </div>
        <div className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 pt-0.5">
          {formatDate(studentFee.next_due_date)}
        </div>
      </div>

    </div>

    {/* Financial Status Highlight Banner */}
    <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/40 dark:to-transparent p-3.5 flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Financial Status
        </p>
        <h4 className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">
          {studentFee.status}
        </h4>
      </div>

      <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm">
        <BadgeCheck className="h-6 w-6" />
      </div>
    </div>

  </div>
);
}