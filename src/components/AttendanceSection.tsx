import { DashboardData } from "@/services/dashboardService";
import { CheckCircle2, XCircle, BarChart3, Clock3, CalendarCheck } from "lucide-react";

interface AttendanceSectionProps {
    data: DashboardData["attendance"];
}

export default function AttendanceSection({
    data,
}: AttendanceSectionProps) {

return (
  <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/80 dark:border-slate-800 shadow-xl p-6 sm:p-8 transition-all">
    {/* Subtle Ambient Background Mesh Gradient */}
    <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

    {/* Header Section */}
    <div className="relative z-10 flex items-center justify-between mb-8">
      <div className="flex items-center gap-3.5">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-xs">
          <BarChart3 size={24} className="stroke-[2.2]" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Attendance Summary
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
            Real-time attendance metrics & performance
          </p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
          Live Tracker
        </span>
      </div>
    </div>

    {/* Stat Cards Grid */}
    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">


{/* Today's Attendance Card */}
      <div className="group relative overflow-hidden rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-5 hover:border-amber-500/40 hover:bg-amber-500/[0.02] hover:-translate-y-1 transition-all duration-300">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r-full bg-amber-500 opacity-80 group-hover:h-14 transition-all duration-300" />
        <div className="flex items-center justify-between pl-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-500">
            Today's Status
          </span>
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform group-hover:scale-110">
            <CalendarCheck size={18} className="stroke-[2.2]" />
          </div>
        </div>
        <div className="mt-3 pl-1">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate">
            {data.todayStatus}
          </h3>
          <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
            <span>●</span> Marked Today
          </p>
        </div>
      </div>


      {/* Present Card */}
      <div className="group relative overflow-hidden rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-5 hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] hover:-translate-y-1 transition-all duration-300">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r-full bg-emerald-500 opacity-80 group-hover:h-14 transition-all duration-300" />
        <div className="flex items-center justify-between pl-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-500">
            Present
          </span>
          <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110">
            <CheckCircle2 size={18} className="stroke-[2.2]" />
          </div>
        </div>
        <div className="mt-3 pl-1">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {data.present}
          </h3>
          <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <span>●</span> Active Days
          </p>
        </div>
      </div>

      {/* Absent Card */}
      <div className="group relative overflow-hidden rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-5 hover:border-rose-500/40 hover:bg-rose-500/[0.02] hover:-translate-y-1 transition-all duration-300">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r-full bg-rose-500 opacity-80 group-hover:h-14 transition-all duration-300" />
        <div className="flex items-center justify-between pl-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-500">
            Absent
          </span>
          <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-transform group-hover:scale-110">
            <XCircle size={18} className="stroke-[2.2]" />
          </div>
        </div>
        <div className="mt-3 pl-1">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {data.absent}
          </h3>
          <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
            <span>●</span> Missed Classes
          </p>
        </div>
      </div>

      

      {/* Leave Card */}
      <div className="group relative overflow-hidden rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-5 hover:border-blue-500/40 hover:bg-blue-500/[0.02] hover:-translate-y-1 transition-all duration-300">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r-full bg-blue-500 opacity-80 group-hover:h-14 transition-all duration-300" />
        <div className="flex items-center justify-between pl-1">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-500">
            Leave Taken
          </span>
          <div className="h-9 w-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center transition-transform group-hover:scale-110">
            <Clock3 size={18} className="stroke-[2.2]" />
          </div>
        </div>
        <div className="mt-3 pl-1">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {data.leave}
          </h3>
          <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
            <span>●</span> Approved Leaves
          </p>
        </div>
      </div>
    </div>

    {/* Modern Progress Bar Section */}
    <div className="relative z-10 mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-500">
            Attendance Rate
          </span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Target: 75%
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {data.percentage}
          </span>
          <span className="text-sm font-extrabold text-emerald-500">%</span>
        </div>
      </div>

      {/* Progress Track with Glowing Bar */}
      <div className="relative w-full h-3.5 rounded-full bg-slate-100 dark:bg-slate-800/80 p-0.5 overflow-hidden border border-slate-200/50 dark:border-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-1000 ease-out relative shadow-sm"
          style={{
            width: `${data.percentage}%`,
          }}
        >
          {/* Edge Glow effect */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 rounded-full blur-[1px]" />
        </div>
      </div>
    </div>
  </div>
);
}