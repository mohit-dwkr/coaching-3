import { Progress } from "@/components/ui/progress";
import { FeeAnalyticsData } from "./analyticsCalculations";

interface CollectionProgressProps {
  analytics: FeeAnalyticsData;
}

export default function CollectionProgress({
  analytics,
}: CollectionProgressProps) {
  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-lg font-semibold">
          Collection Progress
        </h3>
        <p className="text-sm text-muted-foreground">
          Overall fee collection progress
        </p>
      </div>

      <Progress
        value={analytics.collectionPercentage}
        className="h-3"
      />

      <div className="flex items-center justify-between text-sm">
        <span>
          ₹{analytics.totalCollected.toLocaleString("en-IN")} Collected
        </span>

        <span>
          ₹{analytics.totalAssigned.toLocaleString("en-IN")} Total
        </span>
      </div>

      <div className="text-right font-semibold text-primary">
        {analytics.collectionPercentage}%
      </div>
    </div>
  );
}