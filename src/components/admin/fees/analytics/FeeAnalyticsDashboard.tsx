import React from "react";
import AnalyticsGrid from "./AnalyticsGrid";
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
  studentFees, feeTransactions
}: FeeAnalyticsDashboardProps) {

  const analytics = analyticsCalculations(
    studentFees,
    feeTransactions
  );

  return (
    <div className="space-y-6">
      <AnalyticsGrid analytics={analytics} />

  <RecentTransactions
  transactions={feeTransactions}
/>

    </div>
  );
}