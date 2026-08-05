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
 // PaymentHistoryCard Component
return (
  <div className="group relative rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 shadow-sm hover:shadow-md transition-all duration-200 space-y-3.5">
    
    {/* Card Top Strip: Amount & Payment Mode Badge */}
    <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
          Amount Paid
        </span>
        <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight mt-0.5">
          ₹{payment.amount.toLocaleString("en-IN")}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {payment.payment_mode}
        </span>
      </div>
    </div>

    {/* Transaction Key Details Grid */}
    <div className="grid grid-cols-2 gap-2 text-xs">
      
      {/* Receipt No */}
      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
        <Receipt className="h-3.5 w-3.5 text-blue-500 shrink-0" />
        <div className="min-w-0">
          <p className="text-[9px] font-bold text-slate-400 uppercase">Receipt No</p>
          <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{payment.receipt_no}</p>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
        <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
        <div className="min-w-0">
          <p className="text-[9px] font-bold text-slate-400 uppercase">Paid Date</p>
          <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
            {new Date(payment.transaction_date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })}
          </p>
        </div>
      </div>

      {/* Received By */}
      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
        <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
        <div className="min-w-0">
          <p className="text-[9px] font-bold text-slate-400 uppercase">Collected By</p>
          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{payment.received_by}</p>
        </div>
      </div>

      {/* Transaction ID (If Exists) */}
      {payment.transaction_id ? (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
          <CreditCard className="h-3.5 w-3.5 text-purple-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Txn ID</p>
            <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{payment.transaction_id}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 opacity-60">
          <CreditCard className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Txn ID</p>
            <p className="font-semibold text-slate-500 truncate">N/A</p>
          </div>
        </div>
      )}

    </div>

    {/* Validity Duration Banner */}
    <div className="p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 flex items-center gap-2 text-xs">
      <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-700 dark:text-slate-300">
        <span>Validity:</span>
        <span className="font-bold text-slate-900 dark:text-slate-100">
          {new Date(payment.valid_from).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
        </span>
        <span className="text-slate-400">→</span>
        <span className="font-bold text-slate-900 dark:text-slate-100">
          {new Date(payment.valid_until).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
      </div>
    </div>

    {/* Remark Section */}
    <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 px-1">
      <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0 text-slate-400" />
      <p className="italic text-[11px] leading-relaxed">
        {payment.remark || "No additional remarks"}
      </p>
    </div>

    {/* Bottom Print Action Button */}
    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
      <button
        onClick={() => onPrint?.(payment)}
        className="flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm active:scale-95"
      >
        <Printer className="h-3.5 w-3.5" />
        Print Receipt
      </button>
    </div>

  </div>
);
}