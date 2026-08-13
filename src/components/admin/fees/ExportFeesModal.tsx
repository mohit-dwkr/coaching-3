import { useState } from "react";
import { X, FileSpreadsheet, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExportFeesModalProps {
    open: boolean;
    onClose: () => void;

    courses: any[];
    batches: any[];
    students: any[];

    onExportExcel: (
        type: string,
        courseId?: string,
        batchId?: string,
        studentId?: string,
        fromDate?: string,
        toDate?: string
    ) => void;

    onPrint: (
        type: string,
        courseId?: string,
        batchId?: string,
        studentId?: string,
        fromDate?: string,
        toDate?: string
    ) => void;
}

export default function ExportFeesModal({
    open,
    onClose,
    courses,
    batches,
    students,
    onExportExcel,
    onPrint,
}: ExportFeesModalProps) {
   
    const [reportType, setReportType] =
        useState("current");

    const [selectedCourse, setSelectedCourse] =
        useState("all");

    const [selectedBatch, setSelectedBatch] =
        useState("all");

    const [selectedStudent, setSelectedStudent] =
        useState("all");

    const filteredBatches =
        selectedCourse === "all"
            ? batches
            : batches.filter(
                (batch) =>
                    batch.course_id === selectedCourse
            );


            
   const filteredStudents = students.filter((student) => {
    // Course Filter
    if (
        selectedCourse !== "all" &&
        student.course_id !== selectedCourse
    ) {
        return false;
    }
    // Batch Filter
    if (
        selectedBatch !== "all" &&
        student.batch_id !== selectedBatch
    ) {
        return false;
    }
    return true;
});


    const [fromDate, setFromDate] =
        useState("");

    const [toDate, setToDate] =
        useState("");


    const showDateFilter =
        reportType === "complete" ||
        reportType === "course" ||
        reportType === "batch" ||
        reportType === "paid" ||
        reportType === "collection" ||
        reportType === "history";


    if (!open) return null;

   return (
  <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
    
    {/* Main Container Card */}
    <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden transition-all">
      
      {/* 1. HERO HEADER */}
      <div className="p-6 pb-5 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-wider border border-blue-500/20">
            <FileSpreadsheet className="h-3 w-3" /> Report Generator
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Export Fees Report
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Select filters below to generate custom data reports or spreadsheets.
          </p>
        </div>

        <button 
          onClick={onClose}
          className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* 2. FORM BODY */}
      <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
        
        {/* Report Type */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Report Type
          </label>
          <div className="relative">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="current">Current View</option>
              <option value="complete">Complete Report</option>
              <option value="course">Course Report</option>
              <option value="batch">Batch Report</option>
              <option value="pending">Pending Fees</option>
              <option value="paid">Paid Students</option>
              <option value="collection">Collection Report</option>
              <option value="history">Payment History</option>
            </select>
          </div>
        </div>

        {/* Course Filter */}
        {(reportType === "course" ||
          reportType === "batch" ||
          reportType === "paid" ||
          reportType === "collection" ||
          reportType === "history") && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedCourse(value);
                setSelectedBatch("all");
                setSelectedStudent("all");
              }}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Batch Filter */}
        {(reportType === "batch" ||
          reportType === "paid" ||
          reportType === "collection" ||
          reportType === "history") && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select Batch
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedBatch(value);
                setSelectedStudent("all");
              }}
              disabled={selectedCourse === "all"}
              className={`w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer ${
                selectedCourse === "all"
                  ? "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800/30"
                  : ""
              }`}
            >
              <option value="all">
                {selectedCourse === "all" ? "All Batches" : "All Batches"}
              </option>
              {filteredBatches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.batch_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date Filter Section */}
        {showDateFilter && (
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <p className="text-[11px] font-medium text-slate-400 italic">
              {fromDate || toDate
                ? "✓ Selected date range filter applied."
                : "ℹ Leave empty to export lifetime data."}
            </p>
          </div>
        )}

        {/* Student Filter */}
        {reportType === "history" && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-3 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
            >
              <option value="all">
                {selectedBatch === "all" ? "All Students" : "All Students"}
              </option>
              {filteredStudents.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Info Banner: Complete Report */}
        {reportType === "complete" && (
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2 animate-in fade-in duration-200">
            <p className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              This report includes:
            </p>
            <ul className="grid grid-cols-2 gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                All Students
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Paid Students
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Pending Fees
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Collection Report
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Course Wise
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                Batch Wise
              </li>
            </ul>
          </div>
        )}

        {/* Info Banner: Special Report */}
        {reportType === "special" && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 animate-in fade-in duration-200">
            <p className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Includes:
            </p>
            <ul className="space-y-1 text-xs font-medium text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Inactive Students
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Notes Disabled
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                No Batch Assigned
              </li>
            </ul>
          </div>
        )}

      </div>

      {/* 3. FLOATING ACTION FOOTER */}
      <div className="p-5 bg-slate-50/80 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
        <Button
          variant="outline"
          onClick={onClose}
          className="h-10 px-4 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          Cancel
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            onPrint(
              reportType,
              selectedCourse,
              selectedBatch,
              selectedStudent,
              fromDate,
              toDate
            )
          }
          className="h-10 px-4 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all gap-1.5"
        >
          <Printer size={15} />
          Print
        </Button>

        <Button
          onClick={() =>
            onExportExcel(
              reportType,
              selectedCourse,
              selectedBatch,
              selectedStudent,
              fromDate,
              toDate
            )
          }
          className="h-10 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 gap-2 transition-all active:scale-95"
        >
          <FileSpreadsheet size={15} />
          Export Excel
        </Button>
      </div>

    </div>
  </div>
);
}