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
    console.log("Courses Prop", courses);

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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">

            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-xl">

                {/* Header */}

                <div className="flex justify-between items-center">

                    <div>

                        <h2 className="text-2xl font-black">
                            Export Fees Report
                        </h2>

                        <p className="text-slate-500 text-sm mt-1">
                            Choose the report you want to export.
                        </p>

                    </div>

                    <button onClick={onClose}>
                        <X />
                    </button>

                </div>

                {/* Report Type */}

                <div className="mt-8">

                    <label className="text-xs font-bold uppercase text-slate-500">

                        Report Type

                    </label>

                    <select
                        value={reportType}
                        onChange={(e) =>
                            setReportType(e.target.value)
                        }
                        className="w-full mt-2 border rounded-xl p-3"
                    >

                        <option value="current">
                            Current View
                        </option>

                        <option value="complete">
                            Complete Report
                        </option>

                        <option value="course">
                            Course Report
                        </option>

                        <option value="batch">
                            Batch Report
                        </option>

                        <option value="pending">
                            Pending Fees
                        </option>

                        <option value="paid">
                            Paid Students
                        </option>

                        <option value="collection">
                            Collection Report
                        </option>

                        <option value="history">
                            Payment History
                        </option>

                    </select>

                </div>

                {/* Course */}

                {(reportType === "course" ||
                    reportType === "batch" ||
                    reportType === "paid" ||
                    reportType === "collection" ||
                    reportType === "history") && (

                        <div className="mt-6">

                            <label className="text-xs font-bold uppercase text-slate-500">

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
                                className="w-full mt-2 border rounded-xl p-3"
                            >

                                <option value="all">

                                    All Course

                                </option>

                                {courses.map((course) => (

                                    <option
                                        key={course.id}
                                        value={course.id}
                                    >
                                        {course.course_name}
                                    </option>

                                ))}
                            </select>
                        </div>
                    )}


                {/* Batch */}

                {(
                    reportType === "batch" ||
                    reportType === "paid" ||
                    reportType === "collection" ||
                    reportType === "history"
                ) && (

                        <div className="mt-6">

                            <label className="text-xs font-bold uppercase text-slate-500">

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
                                className={`w-full mt-2 border rounded-xl p-3 ${selectedCourse === "all"
                                    ? "bg-slate-100 cursor-not-allowed"
                                    : ""
                                    }`}
                            >

                                <option value="all">
                                    {selectedCourse === "all"
                                        ? "All Batches"
                                        : "All Batches"}
                                </option>
                                {filteredBatches.map((batch) => (
                                    <option
                                        key={batch.id}
                                        value={batch.id}
                                    >
                                        {batch.batch_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}



                {showDateFilter && (
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500">
                                From Date
                            </label>
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(e) =>
                                    setFromDate(e.target.value)
                                }
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-slate-500">
                                To Date
                            </label>
                            <input
                                type="date"
                                value={toDate}
                                onChange={(e) =>
                                    setToDate(e.target.value)
                                }
                                className="w-full mt-2 border rounded-xl p-3"
                            />
                        </div>

                        <p className="text-xs text-slate-500 mt-2">
                            {fromDate || toDate
                                ? "Selected date range will be exported."
                                : "Leave dates empty to export lifetime data."}
                        </p>

                    </div>
                )}



                {reportType === "history" && (
                    <div className="mt-6">
                        <label className="text-xs font-bold uppercase text-slate-500">
                            Select Student
                        </label>
                        <select
                            value={selectedStudent}
                            onChange={(e) =>
                                setSelectedStudent(e.target.value)
                            }
                            className="w-full mt-2 border rounded-xl p-3"
                        >
                            <option value="all">
                                {selectedBatch === "all"
                                    ? "All Students"
                                    : "All Students"}
                            </option>
                            {filteredStudents.map((student) => (
                                <option
                                    key={student.id}
                                    value={student.id}
                                >
                                    {student.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}


                {/* Info */}
                {reportType === "complete" && (

                    <div className="mt-6 bg-blue-50 rounded-2xl p-4">

                        <p className="font-semibold text-blue-700">

                            This report includes:

                        </p>

                        <ul className="mt-2 text-sm text-slate-600 space-y-1">

                            <li>• All Students</li>

                            <li>• Paid Students</li>

                            <li>• Pending Fees</li>

                            <li>• Collection Report</li>

                            <li>• Course Wise</li>

                            <li>• Batch Wise</li>

                        </ul>
                    </div>

                )}

                {reportType === "special" && (

                    <div className="mt-6 bg-orange-50 rounded-2xl p-4">

                        <p className="font-semibold text-orange-700">

                            Includes:

                        </p>

                        <ul className="mt-2 text-sm text-slate-600 space-y-1">

                            <li>• Inactive Students</li>

                            <li>• Notes Disabled</li>

                            <li>• No Batch Assigned</li>

                        </ul>

                    </div>

                )}

                {/* Footer */}

                <div className="flex justify-end gap-3 mt-8">

                    <Button
                        variant="outline"
                        onClick={onClose}
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
                    >
                        <Printer
                            className="mr-2"
                            size={16}
                        />
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
                    >
                        <FileSpreadsheet
                            className="mr-2"
                            size={16}
                        />

                        Export Excel

                    </Button>

                </div>

            </div>

        </div>
    );
}