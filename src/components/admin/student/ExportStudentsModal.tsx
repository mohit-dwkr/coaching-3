import { useState } from "react";
import { X, FileSpreadsheet, Printer, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportStudentsModalProps {
  open: boolean;
  onClose: () => void;

  courses: any[];
  batches: any[];

  onExportExcel: (
    type: string,
    courseId?: string,
    batchId?: string,
    fromDate?: string,
    toDate?: string
  ) => void;

  onPrint: (
    type: string,
    courseId?: string,
    batchId?: string,
    fromDate?: string,
    toDate?: string
  ) => void;
}

export default function ExportStudentsModal({
  open,
  onClose,
  courses,
  batches,
  onExportExcel,
  onPrint,
}: ExportStudentsModalProps) {

  const [reportType, setReportType] =
    useState("current");

  const [selectedCourse, setSelectedCourse] =
    useState("all");

  const [selectedBatch, setSelectedBatch] =
    useState("all");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  if (!open) return null;

return (
  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
    
    <div className="relative bg-white/95 backdrop-blur-2xl rounded-[32px] w-full max-w-lg p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200/80 my-auto overflow-hidden transition-all">
      
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 rounded-2xl border border-blue-100 shrink-0 shadow-2xs">
            <FileSpreadsheet size={24} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Export Students
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
              Choose the report specifications you want to export.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-all shrink-0 active:scale-95"
          title="Close Modal"
        >
          <X size={20} strokeWidth={2.2} />
        </button>
      </div>

      {/* Form Content Wrapper */}
      <div className="mt-6 space-y-5">

        {/* Report Type Select */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            Report Type
          </label>
          <div className="relative group">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full h-11 bg-slate-50/90 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 focus:border-blue-500 rounded-2xl px-3.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer pr-10 shadow-none"
            >
              <option value="current">Current View</option>
              <option value="complete">Complete Report</option>
              <option value="course">Course Report</option>
              <option value="batch">Batch Report</option>
              <option value="special">Special Cases</option>
            </select>
            <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
          </div>
        </div>

        {/* Select Course */}
        {(reportType === "course" || reportType === "batch") && (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Select Course
            </label>
            <div className="relative group">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full h-11 bg-slate-50/90 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 focus:border-blue-500 rounded-2xl px-3.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer pr-10 shadow-none"
              >
                <option value="all">All Courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
            </div>
          </div>
        )}

        {/* Select Batch */}
        {reportType === "batch" && (
          <div className="space-y-1.5 animate-in fade-in duration-200">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Select Batch
            </label>
            <div className="relative group">
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full h-11 bg-slate-50/90 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 focus:border-blue-500 rounded-2xl px-3.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer pr-10 shadow-none"
              >
                <option value="all">All Batches</option>
                {batches
                  .filter(
                    (b) =>
                      selectedCourse === "all" ||
                      b.course_id === selectedCourse
                  )
                  .map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batch_name}
                    </option>
                  ))}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-600 transition-colors" />
            </div>
          </div>
        )}

        {/* Date Filter Range */}
        {reportType !== "current" && reportType !== "special" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full h-11 bg-slate-50/90 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 focus:border-blue-500 rounded-2xl px-3.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full h-11 bg-slate-50/90 hover:bg-slate-100/60 focus:bg-white border border-slate-200/90 focus:border-blue-500 rounded-2xl px-3.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-none"
              />
            </div>
          </div>
        )}

        {/* Report Summary Info Box - Complete Report */}
        {reportType === "complete" && (
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 animate-in fade-in duration-200">
            <p className="font-extrabold text-blue-900 text-xs sm:text-sm flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              This report includes:
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs font-semibold text-blue-700/90">
              <span className="flex items-center gap-1.5">✓ All Students</span>
              <span className="flex items-center gap-1.5">✓ Course Wise</span>
              <span className="flex items-center gap-1.5">✓ Batch Wise</span>
              <span className="flex items-center gap-1.5">✓ Special Cases</span>
            </div>
          </div>
        )}

        {/* Report Summary Info Box - Special Cases */}
        {reportType === "special" && (
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 animate-in fade-in duration-200">
            <p className="font-extrabold text-amber-900 text-xs sm:text-sm flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500"></span>
              Includes:
            </p>
            <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-semibold text-amber-800">
              <span className="flex items-center gap-1.5">✓ Inactive Students</span>
              <span className="flex items-center gap-1.5">✓ Notes Disabled</span>
              <span className="flex items-center gap-1.5">✓ No Batch Assigned</span>
            </div>
          </div>
        )}

      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-2.5 mt-8 pt-4 border-t border-slate-100">
        <Button
          variant="outline"
          onClick={onClose}
          className="w-full sm:w-auto h-11 px-5 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-xs sm:text-sm active:scale-95 transition-all order-3 sm:order-1"
        >
          Cancel
        </Button>

        <Button
          variant="outline"
          className="w-full sm:w-auto h-11 px-5 rounded-xl border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 active:scale-95 transition-all order-2"
          onClick={() =>
            onPrint(
              reportType,
              selectedCourse,
              selectedBatch,
              fromDate,
              toDate
            )
          }
        >
          <Printer className="mr-2 text-slate-500" size={16} />
          <span>Print</span>
        </Button>

        <Button
          className="w-full sm:w-auto h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-95 order-1 sm:order-3"
          onClick={() =>
            onExportExcel(
              reportType,
              selectedCourse,
              selectedBatch,
              fromDate,
              toDate
            )
          }
        >
          <FileSpreadsheet className="mr-2" size={16} />
          <span>Export Excel</span>
        </Button>
      </div>

    </div>
  </div>
);
}