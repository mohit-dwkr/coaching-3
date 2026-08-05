import React from "react";
import {
  IndianRupee,
  Wallet,
  Clock3,
  Percent,
  CalendarDays,
  CalendarRange,
} from "lucide-react";

import {
  StudentFeeData,
  FeeTransaction,
} from "@/components/admin/fees/types";

import { analyticsCalculations } from "./analyticsCalculations";
import RecentTransactions from "./RecentTransactions";

interface FeeAnalyticsDashboardProps {
  studentFees: StudentFeeData[];
  feeTransactions: FeeTransaction[];
}

export default function FeeAnalyticsDashboard({
  studentFees,
  feeTransactions,
}: FeeAnalyticsDashboardProps) {
  // 1. Existing Analytics Calculation Logic (Unchanged)
  const analytics = analyticsCalculations(studentFees, feeTransactions);

  // 2. Structured Cards Configuration Array with Rich Visual Gradients
const cards = [
  {
    title: "TOTAL FEE ASSIGNED",
    value: `₹${analytics.totalAssigned.toLocaleString("en-IN")}`,
    // subtitle: "Total assigned fee amount",
    icon: IndianRupee,
    iconBg: "bg-blue-600 text-white shadow-blue-500/25",
  },
  {
    title: "TOTAL COLLECTED",
    value: `₹${analytics.totalCollected.toLocaleString("en-IN")}`,
    // subtitle: "Successfully collected",
    icon: Wallet,
    iconBg: "bg-emerald-500 text-white shadow-emerald-500/25",
  },
  {
    title: "OUTSTANDING AMOUNT",
    value: `₹${analytics.totalOutstanding.toLocaleString("en-IN")}`,
    // subtitle: "Remaining balance",
    icon: Clock3,
    iconBg: "bg-amber-500 text-white shadow-amber-500/25",
  },
  {
    title: "TODAY'S COLLECTION",
    value: `₹${analytics.todayCollection.toLocaleString("en-IN")}`,
    // subtitle: "Collected today",
    icon: CalendarDays,
    iconBg: "bg-teal-500 text-white shadow-teal-500/25",
  },
  {
    title: "THIS MONTH COLLECTION",
    value: `₹${analytics.monthCollection.toLocaleString("en-IN")}`,
    // subtitle: "Collected this month",
    icon: CalendarRange,
    iconBg: "bg-indigo-600 text-white shadow-indigo-500/25",
  },
  {
    title: "COLLECTION %",
    value: `${analytics.collectionPercentage}%`,
    // subtitle: "Collection efficiency",
    icon: Percent,
    iconBg: "bg-violet-600 text-white shadow-violet-500/25",
  },
];

return (
  <div className="space-y-6">
    {/* Analytics Dynamic Grid - Clean SaaS Style */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-4 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Left Colorful Solid Icon Box (As seen in your screenshot) */}
            <div
              className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center shadow-md ${card.iconBg}`}
            >
              <Icon className="h-7 w-7 stroke-[2.2]" />
            </div>

            {/* Content Area */}
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                {card.title}
              </p>

              <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                {card.value}
              </h2>

              {/* <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {card.subtitle}
              </p> */}
            </div>
          </div>
        );
      })}
    </div>

    {/* Recent Transactions List */}
    <RecentTransactions transactions={feeTransactions} />
  </div>
);
}