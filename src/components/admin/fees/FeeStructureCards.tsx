import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit3,
  Trash2,
  Calendar,
  Layers,
  Power,
} from "lucide-react";
import { FeeStructure } from "./types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FeeStructureCardsProps {
  items: FeeStructure[];
  onEdit: (structure: FeeStructure) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (structure: FeeStructure) => void;
}

export default function FeeStructureCards({
  items,
  onEdit,
  onDelete,
  onToggleStatus,
}: FeeStructureCardsProps) {
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);

  if (items.length === 0) {
    return (
      <Card className="w-full border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center">
        <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100 mb-4 text-slate-400">
          <Layers className="h-8 w-8" />
        </div>
        <h3 className="font-semibold text-slate-900 text-lg">No Fee Structures Found</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1">
          No fee structures match your search. Create a new fee structure to get started.
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const assignedCount = item.assigned_students ?? 0;
          const showDelete = assignedCount === 0;

          const grandTotal =
    Number(item.total_fee || 0) +
    Number(item.admission_fee || 0) +
    Number(item.registration_fee || 0);

          return (
            <Card key={item.id} className="group relative border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden bg-white">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-100 group-hover:bg-primary/40 transition-colors" />

              <CardHeader className="p-5 pb-3 flex flex-row items-start justify-between gap-4 space-y-0">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-900 tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                    {item.course?.course_name || "Unknown Course"}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Duration: <strong>{item.duration_months} Months</strong></span>
                  </div>
                </div>
                <Badge
                  variant={item.status === "active" ? "default" : "secondary"}
                  className={`capitalize tracking-wide px-2.5 py-0.5 rounded-md font-semibold text-[11px] shrink-0 shadow-none ${item.status === "active"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-50"
                    : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                >
                  {item.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>

              <CardContent className="p-5 pt-0 pb-4 space-y-3.5">
                <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Total Course Fee</span>
                  <span>
                    ₹ {grandTotal.toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-0.5 border-l-2 border-slate-100 pl-2.5">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-0.5">
                      Admission
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      ₹{Number(item.admission_fee).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="space-y-0.5 border-l-2 border-slate-100 pl-2.5">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-0.5">
                      Registration
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      ₹{Number(item.registration_fee).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-3 border-t pt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">
                      {item.duration_months} Months
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assigned Students</span>
                    <Badge variant="secondary">
                      {assignedCount}
                    </Badge>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-3">
                <div className="flex items-center justify-end gap-2">

                  {/* Edit */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="h-8 px-3 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white gap-1.5 text-xs"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </Button>

                  {/* Delete */}
                  {showDelete && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 border-slate-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50 bg-white gap-1.5 text-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Fee Structure</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this fee structure? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(item.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {/* Activate / Deactivate */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStructure(item)}
                    className={`h-8 px-3 text-xs gap-1.5 ${item.status === "active"
                        ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                        : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                      }`}
                  >
                    <Power className="h-3.5 w-3.5" />
                    {item.status === "active" ? "Deactivate" : "Activate"}
                  </Button>

                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Reusable Status Confirmation Dialog */}
      <AlertDialog
        open={!!selectedStructure}
        onOpenChange={(open) => {
          if (!open) setSelectedStructure(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedStructure?.status === "active"
                ? "Deactivate Fee Structure"
                : "Activate Fee Structure"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedStructure?.status === "active"
                ? "Existing students will not be affected. This fee structure will no longer be available while assigning fees to new students."
                : "This fee structure will become available again for assigning fees to new students."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedStructure) {
                  onToggleStatus(selectedStructure);
                  setSelectedStructure(null);
                }
              }}
            >
              {selectedStructure?.status === "active" ? "Deactivate" : "Activate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}