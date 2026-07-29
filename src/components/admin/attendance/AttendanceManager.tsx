import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceDrawer from "./AttendanceDrawer";
import AttendanceTable from "./AttendanceTable";
import { toast } from "sonner";
import { exportToExcel } from "@/utils/exportExcel";
import { printTable } from "@/utils/printTable";
import ExportAttendanceModal from "./ExportAttendanceModal";

export default function AttendanceManager() {

    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedBatch, setSelectedBatch] = useState("");

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [
        attendanceSessions,
        setAttendanceSessions,
    ] = useState<any[]>([]);

    const [isExportModalOpen, setIsExportModalOpen] =
        useState(false);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const [selectedSession, setSelectedSession] = useState<{
        courseId: string;
        batchId: string;
        attendanceDate: string;
    } | null>(null);

    const refreshAttendance = () => {
        setRefreshKey(prev => prev + 1);
    };


    const loadExportData = async () => {
        try {
            const [
                coursesRes,
                batchesRes,
                studentsRes,
            ] = await Promise.all([

                supabase
                    .from("Coaching-3_Courses")
                    .select("*")
                    .order("course_name"),

                supabase
                    .from("Coaching-3_StudentBatches")
                    .select("*")
                    .eq("status", "active")
                    .order("batch_name"),

                supabase
                    .from("Coaching-3_Students")
                    .select(`
          *,
          course:Coaching-3_Courses(course_name),
          batch_relation:Coaching-3_StudentBatches(batch_name)
        `)
                    .eq("status", "active")
                    .order("name")

            ]);

            if (coursesRes.data)
                setCourses(coursesRes.data);

            if (batchesRes.data)
                setBatches(batchesRes.data);

            if (studentsRes.data)
                setStudents(studentsRes.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadExportData();
    }, []);


    const mapAttendanceSession = (session: any) => ({
        "Attendance Date": session.attendance_date,

        "Course":
            session.course?.course_name || "",

        "Batch":
            session.batch?.batch_name || "",

        "Present":
            session.present_count,

        "Absent":
            session.absent_count,

        "Leave":
            session.leave_count,

        "Total Students":
            session.total_students,

        "Status":
            session.is_locked
                ? "Locked"
                : "Open",
    });

    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<any[]>([]);
    const [students, setStudents] = useState<any[]>([]);


    const exportAttendance = async (
        reportType: string,
        courseId?: string,
        batchId?: string,
        studentId?: string,
        fromDate?: string,
        toDate?: string
    ) => {

        let exportData = [...attendanceSessions];

        if (reportType === "current") {

            exportData = attendanceSessions;

        }

        if (reportType === "complete") {

            exportData = [...attendanceSessions];

        }


        if (
            reportType === "complete" &&
            (fromDate || toDate)
        ) {

            exportData = exportData.filter(
                (session) => {

                    const date =
                        session.attendance_date;

                    if (fromDate && date < fromDate)
                        return false;

                    if (toDate && date > toDate)
                        return false;

                    return true;

                }
            );
        }



        if (reportType === "course") {
            exportData = attendanceSessions.filter((session) => {
                if (
                    courseId !== "all" &&
                    session.course_id !== courseId
                ) {
                    return false;
                }

                const date = session.attendance_date;

                if (fromDate && date < fromDate)
                    return false;

                if (toDate && date > toDate)
                    return false;
                return true;
            });
        }



        if (reportType === "batch") {
            exportData = attendanceSessions.filter((session) => {
                if (
                    courseId !== "all" &&
                    session.course_id !== courseId
                ) {
                    return false;
                }

                if (
                    batchId !== "all" &&
                    session.batch_id !== batchId
                ) {
                    return false;
                }

                const date = session.attendance_date;

                if (fromDate && date < fromDate)
                    return false;

                if (toDate && date > toDate)
                    return false;

                return true;
            });
        }



        if (reportType === "student") {
            const { data, error } = await supabase
                .from("Coaching-3_AttendanceRecords")
                .select(`
    status,
    remarks,

    student:Coaching-3_Students!attendance_records_student_fk(
      id,
      name,
      roll_number,
      course_id,
      batch_id,

      course:Coaching-3_Courses(
        course_name
      ),

      batch_relation:Coaching-3_StudentBatches(
        batch_name
      )
    ),

    session:Coaching-3_AttendanceSessions!attendance_records_session_fk(
      attendance_date
    )
  `);



            if (error) {
                toast.error(error.message);
                return;
            }


            const filteredData = (data ?? [])

                .filter((record: any) => {

                    if (
                        courseId !== "all" &&
                        record.student?.course_id !== courseId
                    )
                        return false;

                    if (
                        batchId !== "all" &&
                        record.student?.batch_id !== batchId
                    )
                        return false;

                    if (
                        studentId !== "all" &&
                        record.student?.id != studentId
                    )
                        return false;

                    const date =
                        record.session?.attendance_date;

                    if (fromDate && date < fromDate)
                        return false;

                    if (toDate && date > toDate)
                        return false;

                    return true;

                });

            if (!filteredData.length) {
                toast.error("No attendance records found.");
                return;
            }

            exportToExcel({

                fileName: `Student_Attendance_Report_${new Date().toLocaleDateString()}`,

                sheets: [
                    {

                        sheetName: "Student Attendance",

                        data: filteredData.map((record: any) => ({

                            Date:
                                record.session?.attendance_date,

                            Student:
                                record.student?.name,

                            "Roll No":
                                record.student?.roll_number,

                            Course:
                                record.student?.course?.course_name || "",

                            Batch:
                                record.student?.batch_relation?.batch_name || "",

                            Status:
                                record.status,

                            Remarks:
                                record.remarks || "",

                        }))


                    }
                ]
            });
            toast.success("Student report exported.");
            return;
        }



        if (reportType === "present") {
            const { data, error } = await supabase
                .from("Coaching-3_AttendanceRecords")
                .select(`
            status,
            remarks,

            student:Coaching-3_Students!attendance_records_student_fk(
                id,
                name,
                roll_number,
                course_id,
                batch_id,

                course:Coaching-3_Courses(
                    course_name
                ),

                batch_relation:Coaching-3_StudentBatches(
                    batch_name
                )
            ),

            session:Coaching-3_AttendanceSessions!attendance_records_session_fk(
                attendance_date
            )
        `);

            if (error) {
                toast.error(error.message);
                return;
            }

            const filteredData = (data ?? []).filter((record: any) => {

                if (record.status !== "present")
                    return false;

                if (
                    courseId !== "all" &&
                    record.student?.course_id !== courseId
                )
                    return false;

                if (
                    batchId !== "all" &&
                    record.student?.batch_id !== batchId
                )
                    return false;

                const date =
                    record.session?.attendance_date;

                if (fromDate && date < fromDate)
                    return false;

                if (toDate && date > toDate)
                    return false;

                return true;

            });

            if (!filteredData.length) {
                toast.error("No present attendance records found.");
                return;
            }

            exportToExcel({

                fileName: `Present_Attendance_Report_${new Date().toLocaleDateString()}`,

                sheets: [
                    {
                        sheetName: "Present Attendance",

                        data: filteredData.map((record: any) => ({

                            Date: record.session?.attendance_date,

                            Student: record.student?.name,

                            "Roll No": record.student?.roll_number,

                            Course:
                                record.student?.course?.course_name || "",

                            Batch:
                                record.student?.batch_relation?.batch_name || "",

                            Status: record.status,

                            Remarks: record.remarks || "",

                        }))
                    }
                ]
            });
            toast.success("Present report exported.");
            return;
        }



        if (reportType === "absent") {

            const { data, error } = await supabase
                .from("Coaching-3_AttendanceRecords")
                .select(`
            status,
            remarks,

            student:Coaching-3_Students!attendance_records_student_fk(
                id,
                name,
                roll_number,
                course_id,
                batch_id,

                course:Coaching-3_Courses(
                    course_name
                ),

                batch_relation:Coaching-3_StudentBatches(
                    batch_name
                )
            ),

            session:Coaching-3_AttendanceSessions!attendance_records_session_fk(
                attendance_date
            )
        `);

            if (error) {
                toast.error(error.message);
                return;
            }

            const filteredData = (data ?? []).filter((record: any) => {

                if (record.status !== "absent")
                    return false;

                if (
                    courseId !== "all" &&
                    record.student?.course_id !== courseId
                )
                    return false;

                if (
                    batchId !== "all" &&
                    record.student?.batch_id !== batchId
                )
                    return false;

                const date =
                    record.session?.attendance_date;

                if (fromDate && date < fromDate)
                    return false;

                if (toDate && date > toDate)
                    return false;

                return true;

            });

            if (!filteredData.length) {
                toast.error("No absent attendance records found.");
                return;
            }

            exportToExcel({

                fileName: `Absent_Attendance_Report_${new Date().toLocaleDateString()}`,

                sheets: [
                    {
                        sheetName: "Absent Attendance",

                        data: filteredData.map((record: any) => ({

                            Date: record.session?.attendance_date,

                            Student: record.student?.name,

                            "Roll No": record.student?.roll_number,

                            Course:
                                record.student?.course?.course_name || "",

                            Batch:
                                record.student?.batch_relation?.batch_name || "",

                            Status: record.status,

                            Remarks: record.remarks || "",

                        }))
                    }
                ]
            });
            toast.success("Absent report exported.");
            return;
        }




        if (!exportData.length) {
            toast.error("No attendance records found.");
            return;
        }
        exportToExcel({
            fileName: `Attendance_Report_${new Date().toLocaleDateString()}`,
            sheets: [
                {
                    sheetName: "Attendance",

                    data: exportData.map(
                        mapAttendanceSession
                    ),
                },
            ],
        });
        toast.success(
            "Attendance exported successfully."
        );
    };



    const printAttendance = async (
        reportType: string,
        courseId?: string,
        batchId?: string,
        studentId?: string,
        fromDate?: string,
        toDate?: string
    ) => {

        let printData = [...attendanceSessions];

        if (reportType === "current") {
            const rows = printData.map(mapAttendanceSession);
            if (!rows.length) {
                toast.error("No attendance records found.");
                return;
            }
            printTable(
                "Current Attendance Report",
                Object.keys(rows[0]),
                rows
            );
            return;
        }


        if (reportType === "complete") {

            const { data, error } = await supabase
                .from("Coaching-3_AttendanceSessions")
                .select(`
            attendance_date,
            course_id,
            batch_id,

            present_count,
            absent_count,
            leave_count,
            total_students,
            is_locked,

            course:Coaching-3_Courses(
                course_name
            ),

            batch:Coaching-3_StudentBatches(
                batch_name
            )
        `)
                .order("attendance_date", {
                    ascending: false,
                });

            if (error) {
                toast.error(error.message);
                return;
            }

            let printData = data ?? [];

            // Date filter
            if (fromDate || toDate) {

                printData = printData.filter((session: any) => {

                    const date = session.attendance_date;

                    if (fromDate && date < fromDate)
                        return false;

                    if (toDate && date > toDate)
                        return false;

                    return true;

                });

            }

            const rows = printData.map(mapAttendanceSession);
            if (!rows.length) {
                toast.error("No attendance records found.");
                return;
            }
            printTable(
                "Complete Attendance Report",
                Object.keys(rows[0]),
                rows
            );
            return;
        }


        if (reportType === "course") {
            const { data, error } = await supabase
                .from("Coaching-3_AttendanceSessions")
                .select(`
            attendance_date,
            course_id,
            batch_id,

            present_count,
            absent_count,
            leave_count,
            total_students,
            is_locked,

            course:Coaching-3_Courses(
                course_name
            ),

            batch:Coaching-3_StudentBatches(
                batch_name
            )
        `)
                .order("attendance_date", {
                    ascending: false,
                });

            if (error) {
                toast.error(error.message);
                return;
            }

            let printData = data ?? [];

            // Course Filter
            if (
                courseId &&
                courseId !== "all"
            ) {

                printData = printData.filter(
                    (session: any) =>
                        session.course_id === courseId
                );

            }

            // Date Filter
            if (fromDate || toDate) {

                printData = printData.filter(
                    (session: any) => {

                        const date =
                            session.attendance_date;

                        if (
                            fromDate &&
                            date < fromDate
                        )
                            return false;

                        if (
                            toDate &&
                            date > toDate
                        )
                            return false;

                        return true;

                    }
                );

            }

            const rows =
                printData.map(mapAttendanceSession);

            if (!rows.length) {

                toast.error(
                    "No attendance records found."
                );

                return;

            }
            printTable(
                "Course Attendance Report",
                Object.keys(rows[0]),
                rows
            );
            return;
        }



        if (reportType === "batch") {
            const { data, error } = await supabase
                .from("Coaching-3_AttendanceSessions")
                .select(`
            attendance_date,
            course_id,
            batch_id,

            present_count,
            absent_count,
            leave_count,
            total_students,
            is_locked,

            course:Coaching-3_Courses(
                course_name
            ),

            batch:Coaching-3_StudentBatches(
                batch_name
            )
        `)
                .order("attendance_date", {
                    ascending: false,
                });

            if (error) {
                toast.error(error.message);
                return;
            }

            let printData = data ?? [];

            // Course Filter
            if (
                courseId &&
                courseId !== "all"
            ) {
                printData = printData.filter(
                    (session: any) =>
                        session.course_id === courseId
                );
            }

            // Batch Filter
            if (
                batchId &&
                batchId !== "all"
            ) {
                printData = printData.filter(
                    (session: any) =>
                        session.batch_id === batchId
                );
            }

            // Date Filter
            if (fromDate || toDate) {

                printData = printData.filter(
                    (session: any) => {

                        const date =
                            session.attendance_date;

                        if (fromDate && date < fromDate)
                            return false;

                        if (toDate && date > toDate)
                            return false;

                        return true;

                    }
                );

            }

            const rows =
                printData.map(mapAttendanceSession);

            if (!rows.length) {
                toast.error("No attendance records found.");
                return;
            }
            printTable(
                "Batch Attendance Report",
                Object.keys(rows[0]),
                rows
            );
            return;
        }



        if (reportType === "student") {

            const { data, error } = await supabase
                .from("Coaching-3_AttendanceRecords")
                .select(`
            status,
            remarks,

            student:Coaching-3_Students!attendance_records_student_fk(
                id,
                name,
                roll_number,
                course_id,
                batch_id,

                course:Coaching-3_Courses(
                    course_name
                ),

                batch_relation:Coaching-3_StudentBatches(
                    batch_name
                )
            ),

            session:Coaching-3_AttendanceSessions!attendance_records_session_fk(
                attendance_date
            )
        `);

            if (error) {
                toast.error(error.message);
                return;
            }

            const filteredData = (data ?? []).filter((record: any) => {

                if (
                    courseId !== "all" &&
                    record.student?.course_id !== courseId
                )
                    return false;

                if (
                    batchId !== "all" &&
                    record.student?.batch_id !== batchId
                )
                    return false;

                if (
                    studentId !== "all" &&
                    record.student?.id != studentId
                )
                    return false;

                const date = record.session?.attendance_date;

                if (fromDate && date < fromDate)
                    return false;

                if (toDate && date > toDate)
                    return false;

                return true;

            });

            if (!filteredData.length) {
                toast.error("No student attendance records found.");
                return;
            }

            const rows = filteredData.map((record: any) => ({

                Date: record.session?.attendance_date,

                Student: record.student?.name,

                "Roll No": record.student?.roll_number,

                Course:
                    record.student?.course?.course_name || "",

                Batch:
                    record.student?.batch_relation?.batch_name || "",

                Status: record.status,

                Remarks: record.remarks || "",

            }));

            printTable(
                "Student Attendance Report",
                Object.keys(rows[0]),
                rows
            );

            return;
        }


        if (reportType === "present") {

            const { data, error } = await supabase
                .from("Coaching-3_AttendanceRecords")
                .select(`
            status,
            remarks,

            student:Coaching-3_Students!attendance_records_student_fk(
                id,
                name,
                roll_number,
                course_id,
                batch_id,

                course:Coaching-3_Courses(
                    course_name
                ),

                batch_relation:Coaching-3_StudentBatches(
                    batch_name
                )
            ),

            session:Coaching-3_AttendanceSessions!attendance_records_session_fk(
                attendance_date
            )
        `);

            if (error) {
                toast.error(error.message);
                return;
            }

            const filteredData = (data ?? []).filter((record: any) => {

                if (record.status !== "present")
                    return false;

                if (
                    courseId !== "all" &&
                    record.student?.course_id !== courseId
                )
                    return false;

                if (
                    batchId !== "all" &&
                    record.student?.batch_id !== batchId
                )
                    return false;

                const date = record.session?.attendance_date;

                if (fromDate && date < fromDate)
                    return false;

                if (toDate && date > toDate)
                    return false;

                return true;

            });

            if (!filteredData.length) {
                toast.error("No present attendance records found.");
                return;
            }

            const rows = filteredData.map((record: any) => ({

                Date: record.session?.attendance_date,

                Student: record.student?.name,

                "Roll No": record.student?.roll_number,

                Course: record.student?.course?.course_name || "",

                Batch: record.student?.batch_relation?.batch_name || "",

                Status: record.status,

                Remarks: record.remarks || "",

            }));

            printTable(
                "Present Attendance Report",
                Object.keys(rows[0]),
                rows
            );

            return;
        }



        if (reportType === "absent") {

            const { data, error } = await supabase
                .from("Coaching-3_AttendanceRecords")
                .select(`
            status,
            remarks,

            student:Coaching-3_Students!attendance_records_student_fk(
                id,
                name,
                roll_number,
                course_id,
                batch_id,

                course:Coaching-3_Courses(
                    course_name
                ),

                batch_relation:Coaching-3_StudentBatches(
                    batch_name
                )
            ),

            session:Coaching-3_AttendanceSessions!attendance_records_session_fk(
                attendance_date
            )
        `);

            if (error) {
                toast.error(error.message);
                return;
            }

            const filteredData = (data ?? []).filter((record: any) => {

                if (record.status !== "absent")
                    return false;

                if (
                    courseId !== "all" &&
                    record.student?.course_id !== courseId
                )
                    return false;

                if (
                    batchId !== "all" &&
                    record.student?.batch_id !== batchId
                )
                    return false;

                const date = record.session?.attendance_date;

                if (fromDate && date < fromDate)
                    return false;

                if (toDate && date > toDate)
                    return false;

                return true;

            });

            if (!filteredData.length) {
                toast.error("No absent attendance records found.");
                return;
            }

            const rows = filteredData.map((record: any) => ({

                Date: record.session?.attendance_date,

                Student: record.student?.name,

                "Roll No": record.student?.roll_number,

                Course: record.student?.course?.course_name || "",

                Batch: record.student?.batch_relation?.batch_name || "",

                Status: record.status,

                Remarks: record.remarks || "",

            }));

            printTable(
                "Absent Attendance Report",
                Object.keys(rows[0]),
                rows
            );

            return;
        }



    };

    return (
        <div className="space-y-6">

            <AttendanceFilters
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}

                selectedBatch={selectedBatch}
                setSelectedBatch={setSelectedBatch}

                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}

                courses={courses}

                batches={
                    batches.filter(
                        batch =>
                            !selectedCourse ||
                            batch.course_id === selectedCourse
                    )
                }

                onTakeAttendance={() => {

                    if (!selectedCourse || !selectedBatch) {
                        toast.error("Please select course and batch.");
                        return;
                    }

                    setIsDrawerOpen(true);

                }}

                onExport={() => setIsExportModalOpen(true)}
            />


            <AttendanceTable
                refreshKey={refreshKey}
                selectedCourse={selectedCourse}
                selectedBatch={selectedBatch}
                selectedDate={selectedDate}

                onDataLoaded={setAttendanceSessions}

                onOpenAttendance={(session) => {
                    setSelectedCourse(session.course_id);
                    setSelectedBatch(session.batch_id);
                    setSelectedDate(session.attendance_date);
                    setSelectedSession({
                        courseId: session.course_id,
                        batchId: session.batch_id,
                        attendanceDate: session.attendance_date,
                    });
                    setIsDrawerOpen(true);
                }}
            />


            <AttendanceDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}

                selectedCourse={selectedCourse}
                selectedBatch={selectedBatch}
                selectedDate={selectedDate}

                onAttendanceSaved={refreshAttendance}
            />

            <ExportAttendanceModal
                open={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}

                courses={courses}
                batches={batches}
                students={students}

                onExportExcel={exportAttendance}

                onPrint={printAttendance}
            />


        </div>
    );
}