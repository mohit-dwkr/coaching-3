import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import React from 'react'


interface UnassignedStudentTableProps {
  items: any[];
  loading: boolean;
  onAssignFee: (student: any) => void;
}

const UnassignedStudentTable = ({
  items,
  loading,
  onAssignFee,
}: UnassignedStudentTableProps) => {

    if (loading) {
  return <div>Loading...</div>;
}

// Empty State Check
if (!items || items.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-center space-y-3">
      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          All Fees Assigned
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          All students already have fee structures assigned. No pending assignments found.
        </p>
      </div>
    </div>
  );
}

return (
  <div className="w-full space-y-4">
    {/* Section Header with Item Count Badge */}
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Pending Fee Assignments
        </h3>
      </div>
      <span className="text-[11px] font-extrabold text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
        {items.length} {items.length === 1 ? "Student" : "Students"} Pending
      </span>
    </div>

    {/* MODERN COMPACT CARD GRID (Fills screen dynamically without whitespace) */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
      {items.map((student) => (
        <div
          key={student.id}
          className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 shadow-xs hover:shadow-md hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-200"
        >
          {/* Card Top: Student Avatar + Name */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm uppercase shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
              {student.name ? student.name.charAt(0) : "S"}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {student.name}
              </h4>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Awaiting Structure
              </p>
            </div>
          </div>

          {/* Student Metadata Box (Course & Batch) */}
          <div className="grid grid-cols-2 gap-2 my-3.5 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80">
            <div className="min-w-0">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                Course
              </span>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate block mt-0.5">
                {student.course?.course_name ?? "-"}
              </span>
            </div>

            <div className="min-w-0 border-l border-slate-200/60 dark:border-slate-700/60 pl-2.5">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                Batch
              </span>
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 truncate block mt-0.5">
                {student.batch?.batch_name ?? "-"}
              </span>
            </div>
          </div>

          {/* Full-width Action Button */}
          <Button
            size="sm"
            onClick={() => {
              onAssignFee(student);
            }}
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-extrabold text-xs py-2 shadow-xs shadow-blue-500/20 active:scale-[0.98] transition-all"
          >
            Assign Fee Structure
          </Button>
        </div>
      ))}
    </div>
  </div>
);
}
export default UnassignedStudentTable
