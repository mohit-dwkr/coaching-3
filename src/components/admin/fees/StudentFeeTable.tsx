import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, CreditCard } from "lucide-react";
import { StudentFeeData} from "./types";

interface StudentFeeTableProps {
  items: StudentFeeData[];
  loading: boolean;
  onEdit: (ledger: StudentFeeData) => void;
  onDelete: (id: string) => void;
  onCollect?: (fee: StudentFeeData) => void;
}

export default function StudentFeeTable({
  items,
  loading,
  onEdit,
  onDelete,
  onCollect,
}: StudentFeeTableProps) {
  const getStatusBadge = (status: StudentFeeData["status"]) => {
    switch (status) {
      case "Paid":
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            Paid
          </Badge>
        );

      case "Partial":
        return (
          <Badge className="bg-amber-50 text-amber-700 border border-amber-200/60">
            Partial
          </Badge>
        );

      case "Pending":
        return (
          <Badge className="bg-rose-50 text-rose-700 border border-rose-200/60">
            Pending
          </Badge>
        );

      case "Overdue":
        return (
          <Badge className="bg-red-100 text-red-800 border border-red-300">
            Overdue
          </Badge>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/70 border-b border-slate-200">
              <TableRow>
                <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase">Student Details</TableHead>
                <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase">Course / Track</TableHead>
                <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase">Assigned Batch</TableHead>
                <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase text-right">Total Course Fee</TableHead>
                <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase text-right">Discount</TableHead>
                <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase text-right">Final Payable Fee</TableHead>
                <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase text-right">Collected</TableHead>
                <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase text-right">Outstanding Balance</TableHead>
                <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase">Due Date</TableHead>
                <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase text-right w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index} className="border-b border-slate-100">
                  <TableCell className="py-3.5"><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell className="py-3.5"><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="py-3.5"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="py-3.5 text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="py-3.5 text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                  <TableCell className="py-3.5 text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="py-3.5 text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="py-3.5 text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                  <TableCell className="py-3.5"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="py-3.5"><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="py-3.5 text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card className="w-full border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center">
        <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100 mb-4 text-slate-400">
          <CreditCard className="h-8 w-8" />
        </div>
        <h3 className="font-semibold text-slate-900 text-lg">No Student Fees Found</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1">
          No student fee records found.
          Assign a fee structure to students to begin fee tracking.
        </p>
      </Card>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50/70 border-b border-slate-200">
            <TableRow>
              <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase">Student Details</TableHead>

              <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase">Course / Track</TableHead>

              <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase">Assigned Batch</TableHead>

              <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase text-right">Total Course Fee</TableHead>

              <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase text-right">Discount</TableHead>

              <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase text-right">Final Payable Fee</TableHead>

              <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase text-right">Collected</TableHead>

              <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase text-right">Outstanding Balance</TableHead>

              <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase">Due Date</TableHead>

              <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase">Status</TableHead>

              <TableHead className="font-semibold text-slate-700 h-11 text-xs tracking-wider uppercase text-right w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((ledger) => (
              <TableRow key={ledger.id} className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors">

                <TableCell className="font-semibold text-slate-900 text-sm py-3.5">
                  {ledger.student?.name ?? "-"}
                </TableCell>

                <TableCell className="text-slate-600 text-sm py-3.5">
                  {ledger.course?.course_name ?? "-"}
                </TableCell>

                <TableCell className="text-slate-600 text-sm py-3.5">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-700">
                    {ledger.student?.batch?.batch_name ?? "-"}
                  </span>
                </TableCell>

                <TableCell className="font-medium text-slate-900 text-sm text-right py-3.5">
                  ₹{ledger.total_fee.toLocaleString("en-IN")}
                </TableCell>

                {/* Discount */}
                <TableCell className="text-right font-medium text-slate-700 py-3.5 text-sm">
                  ₹{ledger.discount.toLocaleString("en-IN")}
                </TableCell>

                {/* Final Payable Fee */}
                <TableCell className="text-right font-semibold text-slate-900 py-3.5 text-sm">
                  ₹{ledger.final_fee.toLocaleString("en-IN")}
                </TableCell>

                {/* Collected */}
                <TableCell className="text-right font-semibold text-emerald-600 py-3.5 text-sm">
                  ₹{ledger.paid_amount.toLocaleString("en-IN")}
                </TableCell>

                {/* Outstanding Balance */}
                <TableCell
                  className={`text-right font-semibold py-3.5 text-sm ${ledger.remaining_amount > 0
                      ? "text-rose-600"
                      : "text-slate-500"
                    }`}
                >
                  ₹{ledger.remaining_amount.toLocaleString("en-IN")}
                </TableCell>

                <TableCell className="text-slate-500 text-sm py-3.5">
                  {ledger.next_due_date
                    ? new Date(ledger.next_due_date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                    : "-"}
                </TableCell>

                <TableCell className="font-semibold text-slate-900 text-sm py-3.5">
                  {getStatusBadge(ledger.status)}
                </TableCell>

                <TableCell className="text-right py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(ledger)}
                      className="h-8 px-2.5 border-slate-200 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg gap-1 text-xs font-medium shadow-none"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCollect?.(ledger)}
                      
                      className="h-8 px-2.5 border-slate-200 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 rounded-lg gap-1 text-xs font-medium shadow-none"
                    >
                      <CreditCard className="h-3.5 w-3.5" /> Collect
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}