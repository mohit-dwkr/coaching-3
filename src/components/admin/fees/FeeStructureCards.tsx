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
  Users,
  CreditCard,
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
          <Card 
            key={item.id} 
            className="group relative border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white dark:bg-slate-900 rounded-3xl"
          >
            {/* Top Hover Accent Glow */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Header Section */}
            <CardHeader className="p-6 pb-4 flex flex-row items-start justify-between gap-3 space-y-0">
              <div className="space-y-1.5 pr-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {item.course?.course_name || "Unknown Course"}
                </h3>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" />
                  <span>Duration: {item.duration_months} Months</span>
                </div>
              </div>

              {/* Status Badge */}
              <Badge
                variant={item.status === "active" ? "default" : "secondary"}
                className={`capitalize tracking-wide px-3 py-1 rounded-full font-bold text-[11px] shrink-0 border transition-all ${
                  item.status === "active"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/60"
                    : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${item.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                {item.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </CardHeader>

            {/* Body Information */}
            <CardContent className="p-6 pt-0 space-y-4">
              
              {/* Grand Total Highlight Box */}
              <div className="bg-gradient-to-br from-blue-50/80 to-slate-50 dark:from-blue-950/20 dark:to-slate-900/60 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 flex items-center justify-between shadow-inner">
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-blue-600/80 dark:text-blue-400">
                    Total Course Fee
                  </p>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-50 tracking-tight mt-0.5">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/20">
                  <CreditCard className="h-5 w-5" />
                </div>
              </div>

              {/* Fee Breakdown Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Admission Fee
                  </span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    ₹{Number(item.admission_fee).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl p-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Registration Fee
                  </span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    ₹{Number(item.registration_fee).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Student Assignment Info Strip */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  Assigned Students
                </span>
                <span className="font-extrabold px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-700 dark:text-slate-300">
                  {assignedCount}
                </span>
              </div>
            </CardContent>

            {/* Footer Actions */}
            <CardFooter className="p-4 bg-slate-50/60 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
              
              {/* Left Action - Status Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStructure(item)}
                className={`h-9 px-3 rounded-xl text-xs font-semibold gap-1.5 transition-all active:scale-95 ${
                  item.status === "active"
                    ? "border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/50"
                    : "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                }`}
              >
                <Power className="h-3.5 w-3.5" />
                <span>{item.status === "active" ? "Deactivate" : "Activate"}</span>
              </Button>

              {/* Right Actions - Edit & Delete */}
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="h-9 px-3 rounded-xl border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 gap-1.5 text-xs font-semibold active:scale-95 transition-all"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </Button>

                {showDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 rounded-xl border-rose-200/80 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-400 dark:hover:bg-rose-950/50 bg-white dark:bg-slate-900 gap-1.5 text-xs font-semibold active:scale-95 transition-all"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Fee Structure</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this fee structure? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(item.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
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
      <AlertDialogContent className="rounded-2xl">
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
          <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
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