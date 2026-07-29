import React from "react";
import {
  IndianRupee,
  Wallet,
  Clock3,
  Percent,
  AlertTriangle,
  Users,
  CalendarDays,
  CalendarRange,
} from "lucide-react";

import AnalyticsCard from "./AnalyticsCard";
import { FeeAnalyticsData } from "./analyticsCalculations";

interface AnalyticsGridProps {
  analytics: FeeAnalyticsData;
}

export default function AnalyticsGrid({
  analytics,
}: AnalyticsGridProps) {

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      <AnalyticsCard
        title="Total Fee Assigned"
        value={`₹${analytics.totalAssigned.toLocaleString("en-IN")}`}
        subtitle="Total assigned fee amount"
        icon={IndianRupee}
        iconBgClass="bg-blue-100"
        iconColorClass="text-blue-700"
      />

      <AnalyticsCard
        title="Total Collected"
        value={`₹${analytics.totalCollected.toLocaleString("en-IN")}`}
        subtitle="Successfully collected"
        icon={Wallet}
        iconBgClass="bg-emerald-100"
        iconColorClass="text-emerald-700"
      />

      <AnalyticsCard
        title="Outstanding Amount"
        value={`₹${analytics.totalOutstanding.toLocaleString("en-IN")}`}
        subtitle="Remaining balance"
        icon={Clock3}
        iconBgClass="bg-amber-100"
        iconColorClass="text-amber-700"
      />

      <AnalyticsCard
        title="Collection %"
        value={`${analytics.collectionPercentage}%`}
        subtitle="Collection efficiency"
        icon={Percent}
        iconBgClass="bg-violet-100"
        iconColorClass="text-violet-700"
      />

      <AnalyticsCard
        title="Today's Collection"
        value={`₹${analytics.todayCollection.toLocaleString("en-IN")}`}
        subtitle="Collected today"
        icon={CalendarDays}
        iconBgClass="bg-green-100"
        iconColorClass="text-green-700"
      />

      <AnalyticsCard
        title="This Month Collection"
        value={`₹${analytics.monthCollection.toLocaleString("en-IN")}`}
        subtitle="Collected this month"
        icon={CalendarRange}
        iconBgClass="bg-blue-100"
        iconColorClass="text-blue-700"
      />

    </div>
  );
}