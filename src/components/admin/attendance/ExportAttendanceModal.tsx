import React, { useState } from 'react'
import { X, FileSpreadsheet, Printer, Calendar, ChevronDown, User, Layers, BookOpen, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";


interface ExportAttendanceModalProps {
  open: boolean;
  onClose: () => void;

  courses: any[];
  batches: any[];
  students: any[];

  onExportExcel: (
    reportType: string,
    courseId?: string,
    batchId?: string,
    studentId?: string,
    fromDate?: string,
    toDate?: string
  ) => void;

  onPrint: (
    reportType: string,
    courseId?: string,
    batchId?: string,
    studentId?: string,
    fromDate?: string,
    toDate?: string
  ) => void;
}



const ExportAttendanceModal = ({
  open,
  onClose,
  courses,
  batches,
  students,
  onExportExcel,
  onPrint,
}: ExportAttendanceModalProps) => {

  const [reportType, setReportType] =
    useState("current");

  const [selectedCourse, setSelectedCourse] =
    useState("all");

  const [selectedBatch, setSelectedBatch] =
    useState("all");

  const [selectedStudent, setSelectedStudent] =
    useState("all");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");


  const filteredStudents = students.filter((student) => {
    if (
      selectedCourse !== "all" &&
      student.course_id !== selectedCourse
    ) {
      return false;
    }

    if (
      selectedBatch !== "all" &&
      student.batch_id !== selectedBatch
    ) {
      return false;
    }
    return true;
  });




  if (!open) return null;
return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200/80 transform transition-all duration-300 space-y-6 overflow-hidden">
        
        {/* Subtle Background Glow Accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Modal Header */}
        <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl shadow-md shadow-indigo-500/20 shrink-0">
              <Download size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Export Attendance
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Choose the report parameters you want to export.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all duration-200"
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-5">
          
          {/* Report Type */}
          <div>
            <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 mb-1.5">
              <Filter size={13} className="text-indigo-600" />
              Report Type
            </label>
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full h-11 border border-slate-200/90 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white rounded-2xl px-3.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 appearance-none cursor-pointer pr-10 shadow-xs"
              >
                <option value="current">Current View</option>
                <option value="complete">Complete Report</option>
                <option value="course">Course Report</option>
                <option value="batch">Batch Report</option>
                <option value="student">Student Report</option>
                <option value="present">Present Report</option>
                <option value="absent">Absent Report</option>
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Select Course */}
          {(reportType === "course" ||
            reportType === "batch" ||
            reportType === "student" ||
            reportType === "present" ||
            reportType === "absent") && (
            <div className="animate-in fade-in duration-200">
              <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 mb-1.5">
                <BookOpen size={13} className="text-indigo-600" />
                Select Course
              </label>
              <div className="relative">
                <select
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    setSelectedBatch("all");
                    setSelectedStudent("all");
                  }}
                  className="w-full h-11 border border-slate-200/90 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white rounded-2xl px-3.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 appearance-none cursor-pointer pr-10 shadow-xs"
                >
                  <option value="all">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Select Batch */}
          {(reportType === "batch" ||
            reportType === "student" ||
            reportType === "present" ||
            reportType === "absent") && (
            <div className="animate-in fade-in duration-200">
              <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 mb-1.5">
                <Layers size={13} className="text-indigo-600" />
                Select Batch
              </label>
              <div className="relative">
                <select
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                    setSelectedStudent("all");
                  }}
                  className="w-full h-11 border border-slate-200/90 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white rounded-2xl px-3.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 appearance-none cursor-pointer pr-10 shadow-xs"
                >
                  <option value="all">All Batches</option>
                  {batches
                    .filter(
                      (batch) =>
                        selectedCourse === "all" ||
                        batch.course_id === selectedCourse
                    )
                    .map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.batch_name}
                      </option>
                    ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Select Student */}
          {reportType === "student" && (
            <div className="animate-in fade-in duration-200">
              <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 mb-1.5">
                <User size={13} className="text-indigo-600" />
                Select Student
              </label>
              <div className="relative">
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full h-11 border border-slate-200/90 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white rounded-2xl px-3.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 appearance-none cursor-pointer pr-10 shadow-xs"
                >
                  <option value="all">All Students</option>
                  {filteredStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Date Range Selection */}
          {reportType !== "current" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 animate-in fade-in duration-200">
              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Calendar size={13} className="text-indigo-600" />
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full h-11 border border-slate-200/90 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white rounded-2xl px-3.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 cursor-pointer shadow-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Calendar size={13} className="text-indigo-600" />
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full h-11 border border-slate-200/90 bg-slate-50/70 hover:bg-slate-100/60 focus:bg-white rounded-2xl px-3.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 cursor-pointer shadow-xs"
                />
              </div>
            </div>
          )}

        </div>

        {/* Action Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-5 rounded-2xl border-slate-200 text-slate-700 hover:bg-slate-100/80 font-bold text-xs sm:text-sm transition-all duration-200 active:scale-95"
          >
            Cancel
          </Button>

          <Button
            type="button"
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
            className="w-full sm:w-auto h-11 px-5 rounded-2xl border-slate-200/90 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-2xs hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <Printer size={16} className="text-slate-500" strokeWidth={2.2} />
            <span>Print</span>
          </Button>

          <Button
            type="button"
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
            className="w-full sm:w-auto h-11 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <FileSpreadsheet size={16} strokeWidth={2.2} />
            <span>Export Excel</span>
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ExportAttendanceModal;