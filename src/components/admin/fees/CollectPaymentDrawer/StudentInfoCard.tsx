import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudentFeeData } from "../types";
import { GraduationCap, Phone, User, Users } from "lucide-react";

interface StudentInfoCardProps {
  studentFee: StudentFeeData | null;
}

export default function StudentInfoCard({
  studentFee,
}: StudentInfoCardProps) {
  if (!studentFee) return null;

return (
  <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-4 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-700">
    
    {/* Header Title with Avatar Icon */}
    <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800/60">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <User className="h-4 w-4" />
        </div>
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Student Information
        </h3>
      </div>
      <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
        Verified Student
      </span>
    </div>

    {/* Information Grid */}
    <div className="grid grid-cols-2 gap-3">

      {/* 1. Student Name */}
      <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <User className="h-3 w-3" />
          Student Name
        </span>
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
          {studentFee.student?.name || "N/A"}
        </p>
      </div>

      {/* 2. Course */}
      <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <GraduationCap className="h-3 w-3" />
          Course
        </span>
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
          {studentFee.course?.course_name || "N/A"}
        </p>
      </div>

      {/* 3. Batch */}
      <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Users className="h-3 w-3" />
          Batch
        </span>
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
          {studentFee.student?.batch?.batch_name || "N/A"}
        </p>
      </div>

      {/* 4. Mobile */}
      <div className="space-y-1.5 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
          <Phone className="h-3 w-3" />
          Mobile Number
        </span>
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
          {studentFee.student?.mobile || "N/A"}
        </p>
      </div>

    </div>

  </div>
);
}