// import React from "react";
// import {
//   IndianRupee,
//   Wallet,
//   Clock3,
//   Percent,
//   AlertTriangle,
//   Users,
//   CalendarDays,
//   CalendarRange,
// } from "lucide-react";

// import AnalyticsCard from "./AnalyticsCard";
// import { FeeAnalyticsData } from "./analyticsCalculations";

// interface AnalyticsGridProps {
//   analytics: FeeAnalyticsData;
// }

// export default function AnalyticsGrid({
//   analytics,
// }: AnalyticsGridProps) {

// return (
//   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
//     <AnalyticsCard
//       title="Total Fee Assigned"
//       value={`₹${analytics.totalAssigned.toLocaleString("en-IN")}`}
//       subtitle="Total assigned fee amount"
//       icon={IndianRupee}
//       iconBgClass="bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50"
//       iconColorClass="text-blue-600 dark:text-blue-400"
//     />

//     <AnalyticsCard
//       title="Total Collected"
//       value={`₹${analytics.totalCollected.toLocaleString("en-IN")}`}
//       subtitle="Successfully collected"
//       icon={Wallet}
//       iconBgClass="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50"
//       iconColorClass="text-emerald-600 dark:text-emerald-400"
//     />

//     <AnalyticsCard
//       title="Outstanding Amount"
//       value={`₹${analytics.totalOutstanding.toLocaleString("en-IN")}`}
//       subtitle="Remaining balance"
//       icon={Clock3}
//       iconBgClass="bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900/50"
//       iconColorClass="text-amber-600 dark:text-amber-400"
//     />

//     <AnalyticsCard
//       title="Collection %"
//       value={`${analytics.collectionPercentage}%`}
//       subtitle="Collection efficiency"
//       icon={Percent}
//       iconBgClass="bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900/50"
//       iconColorClass="text-violet-600 dark:text-violet-400"
//     />

//     <AnalyticsCard
//       title="Today's Collection"
//       value={`₹${analytics.todayCollection.toLocaleString("en-IN")}`}
//       subtitle="Collected today"
//       icon={CalendarDays}
//       iconBgClass="bg-teal-50 dark:bg-teal-950/60 border border-teal-100 dark:border-teal-900/50"
//       iconColorClass="text-teal-600 dark:text-teal-400"
//     />

//     <AnalyticsCard
//       title="This Month Collection"
//       value={`₹${analytics.monthCollection.toLocaleString("en-IN")}`}
//       subtitle="Collected this month"
//       icon={CalendarRange}
//       iconBgClass="bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50"
//       iconColorClass="text-indigo-600 dark:text-indigo-400"
//     />
//   </div>
// );
// }