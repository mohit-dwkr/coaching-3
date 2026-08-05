import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeeTransaction } from "../types";
import { ArrowUpRight, Receipt } from "lucide-react";

interface RecentTransactionsProps {
    transactions: FeeTransaction[];
}

export default function RecentTransactions({
    transactions,
}: RecentTransactionsProps) {
    const recentTransactions = transactions.slice(0, 3);

return (
  <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm rounded-3xl overflow-hidden">
    {/* Card Header with Icon */}
    <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 pb-4 pt-5 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Recent Transactions
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Latest payment activity logs
            </p>
          </div>
        </div>

        {recentTransactions.length > 0 && (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700">
            {recentTransactions.length} Activity
          </span>
        )}
      </div>
    </CardHeader>

    {/* Card Content Body */}
    <CardContent className="p-6">
      {recentTransactions.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <div className="mx-auto w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Receipt className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            No recent transactions recorded yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/60 hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-all duration-200 group"
            >
              {/* Left Side: Transaction Info */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Receipt className="h-5 w-5 stroke-[2]" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-wide font-mono">
                    #{transaction.id.slice(0, 8).toUpperCase()}
                  </p>

                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {transaction.payment_mode}
                  </span>
                </div>
              </div>

              {/* Right Side: Amount & Date */}
              <div className="text-right space-y-0.5">
                <p className="text-sm font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                  + ₹{transaction.amount.toLocaleString("en-IN")}
                </p>

                <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                  {new Date(transaction.transaction_date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);
}