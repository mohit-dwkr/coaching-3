import { Button } from "@/components/ui/button";

type FilterType =
  | "all"
  | "assigned"
  | "unassigned"
  | "pending"
  | "overdue"
  | "partial";

interface StudentFeeFiltersProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;

  totalCount: number;
  assignedCount: number;
  unassignedCount: number;
  overdueCount: number;
  pendingCount: number;
  partialCount: number;
}

const StudentFeeFilters = ({
  filter,
  onFilterChange,
  totalCount,
  assignedCount,
  unassignedCount,
  overdueCount,
  pendingCount,
  partialCount,
}: StudentFeeFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        onClick={() => onFilterChange("all")}
      >
        All ({totalCount})
      </Button>

      <Button
        variant={filter === "assigned" ? "default" : "outline"}
        onClick={() => onFilterChange("assigned")}
      >
        Assigned ({assignedCount})
      </Button>

      <Button
        variant={filter === "unassigned" ? "default" : "outline"}
        onClick={() => onFilterChange("unassigned")}
      >
        Not Assigned ({unassignedCount})
      </Button>

      <Button
        variant={filter === "pending" ? "default" : "outline"}
        onClick={() => onFilterChange("pending")}
      >
        Pending ({pendingCount})
      </Button>

      <Button
        variant={filter === "overdue" ? "default" : "outline"}
        onClick={() => onFilterChange("overdue")}
      >
        Overdue ({overdueCount})
      </Button>

      <Button
        variant={filter === "partial" ? "default" : "outline"}
        onClick={() => onFilterChange("partial")}
      >
        Partial ({partialCount})
      </Button>
    </div>
  );
};

export default StudentFeeFilters;