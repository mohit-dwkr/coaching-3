import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";

import {
    X,
    Search,
    Users,
    Calendar,
    GraduationCap,
    CheckCircle2,
    XCircle,
    Clock3,
    Loader2,
} from "lucide-react";


interface AttendanceDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCourse: string;
    selectedBatch: string;
    selectedDate: string;
    onAttendanceSaved: () => void;
}


interface AttendanceStudent {
    id: string;
    name: string;
    roll_number: number | null;
    attendanceStatus: "present" | "absent" | "leave";
    remarks?: string;
    isModified?: boolean;
}

interface AttendanceRecord {
    student_id: string;
    status: "present" | "absent" | "leave";
    remarks: string | null;
}


export default function AttendanceDrawer({

    isOpen,
    onClose,
    selectedCourse,
    selectedBatch,
    selectedDate,
    onAttendanceSaved,

}: AttendanceDrawerProps) {


    const [students, setStudents] =
        useState<AttendanceStudent[]>([]);

    const [courseName, setCourseName] =
        useState("");

    const [batchName, setBatchName] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [saving, setSaving] =
        useState(false);

    const [hasChanges, setHasChanges] =
        useState(false);

    const [sessionLocked, setSessionLocked] =
        useState(false);

    const [sessionId, setSessionId] =
        useState<string | null>(null);

    // =========================
    // DATABASE FUNCTIONS
    // =========================

    const fetchCourse = async () => {

        if (!selectedCourse) return;

        const { data, error } = await supabase
            .from("Coaching-3_Courses")
            .select("course_name")
            .eq("id", selectedCourse)
            .single();

        if (error) {
            toast.error(error.message);
            return;
        }
        setCourseName(data.course_name);
    };


    const fetchBatch = async () => {

        if (!selectedBatch) return;

        const { data, error } = await supabase
            .from("Coaching-3_StudentBatches")
            .select("batch_name")
            .eq("id", selectedBatch)
            .single();

        if (error) {
            toast.error(error.message);
            return;
        }

        setBatchName(data.batch_name);

    };


    const fetchStudents = async () => {

        if (!selectedBatch) return;

        try {

            setLoading(true);

            const { data, error } = await supabase
                .from("Coaching-3_Students")
                .select(`
                id,
                name,
                roll_number
            `)
                .eq("batch_id", selectedBatch)
                .order("roll_number", {
                    ascending: true,
                });

            if (error) throw error;

            const studentList = data || [];

            // Existing attendance available
            if (sessionId) {
                await loadAttendanceRecords(studentList);
                return;
            }

            // Default attendance (new session)
            const attendanceStudents: AttendanceStudent[] =
                studentList.map(student => ({
                    ...student,
                    attendanceStatus: "present",
                    remarks: "",
                    isModified: false,
                }));

            setStudents(attendanceStudents);

        } catch (error: any) {

            toast.error(error.message);

        } finally {

            setLoading(false);
        }

    };


    const loadAttendanceRecords = async (
        studentList: {
            id: string;
            name: string;
            roll_number: number | null;
        }[]
    ) => {

        if (!sessionId) return;

        const { data, error } = await supabase
            .from("Coaching-3_AttendanceRecords")
            .select(`
            student_id,
            status,
            remarks
        `)
            .eq("session_id", sessionId);

        if (error) {
            toast.error(error.message);
            return;
        }

        const attendanceMap = new Map<string, AttendanceRecord>(
            ((data || []) as AttendanceRecord[]).map(record => [
                record.student_id,
                record,
            ])
        );

        const mergedStudents: AttendanceStudent[] =
            studentList.map(student => {

                const attendance =
                    attendanceMap.get(student.id);

                return {

                    ...student,

                    attendanceStatus:
                        attendance?.status ?? "present",

                    remarks:
                        attendance?.remarks ?? "",

                };

            });

        setStudents(mergedStudents);

    };

    const checkAttendanceSession = async () => {
        if (!selectedBatch || !selectedDate) return;
        const { data, error } = await supabase
            .from("Coaching-3_AttendanceSessions")
            .select("id, is_locked")
            .eq("batch_id", selectedBatch)
            .eq("attendance_date", selectedDate)
            .maybeSingle();

        if (error) {
            toast.error(error.message);
            return;
        }
        if (!data) {
            setSessionId(null);
            setSessionLocked(false);
            await fetchStudents();
            return;
        }
        setSessionId(data.id);
        setSessionLocked(data.is_locked);

    };


    useEffect(() => {
        if (!isOpen) return;
        fetchCourse();
        fetchBatch();
        checkAttendanceSession();
    }, [
        isOpen,
        selectedCourse,
        selectedBatch,
        selectedDate,
    ]);


    useEffect(() => {

        if (!isOpen || !selectedBatch) return;

        fetchStudents();

    }, [
        sessionId,
        isOpen,
        selectedBatch,
    ]);

    useEffect(() => {

        if (isOpen) return;

        setStudents([]);
        setSearch("");
        setCourseName("");
        setBatchName("");
        setSessionId(null);
        setSessionLocked(false);
        setHasChanges(false);

    }, [isOpen]);

    // =========================
    // HELPER FUNCTIONS
    // =========================

    const updateAttendanceStatus = (
        studentId: string,
        status: "present" | "absent" | "leave"

    ) => {

        setStudents(prev =>
            prev.map(student =>
                student.id === studentId
                    ? {
                        ...student,
                        attendanceStatus: status,
                        isModified: true,
                    }
                    : student
            )
        );
        setHasChanges(true);
    };


    const saveAttendance = async () => {

        if (sessionLocked) {
            toast.error("Attendance is locked.");
            return;
        }

        if (!selectedBatch || !selectedCourse || !selectedDate) {
            toast.error("Missing attendance details.");
            return;
        }

        try {

            setSaving(true);

            let currentSessionId = sessionId;

            // =========================
            // CREATE SESSION
            // =========================

            if (!currentSessionId) {

                const { data, error } = await supabase
                    .from("Coaching-3_AttendanceSessions")
                    .insert({
                        course_id: selectedCourse,
                        batch_id: selectedBatch,
                        attendance_date: selectedDate,
                        is_locked: false,
                    })
                    .select("id")
                    .single();

                if (error) throw error;

                currentSessionId = data.id;

                setSessionId(currentSessionId);

            }

            // =========================
            // PREPARE RECORDS
            // =========================

            const attendanceRecords = students.map(student => ({

                session_id: currentSessionId,

                student_id: student.id,

                roll_number: student.roll_number,

                status: student.attendanceStatus,

                remarks: student.remarks || null,

                updated_at: new Date().toISOString(),

            }));


            // =========================
            // UPSERT RECORDS
            // =========================

            const { error } = await supabase
                .from("Coaching-3_AttendanceRecords")
                .upsert(
                    attendanceRecords,
                    {
                        onConflict: "session_id,student_id",
                    }
                );
            if (error) throw error;


            // =========================
            // UPDATE SESSION SUMMARY
            // =========================

            const presentCount = students.filter(
                s => s.attendanceStatus === "present"
            ).length;

            const absentCount = students.filter(
                s => s.attendanceStatus === "absent"
            ).length;

            const leaveCount = students.filter(
                s => s.attendanceStatus === "leave"
            ).length;

            const { error: sessionError } = await supabase
                .from("Coaching-3_AttendanceSessions")
                .update({

                    present_count: presentCount,

                    absent_count: absentCount,

                    leave_count: leaveCount,

                    total_students: students.length,

                    updated_at: new Date().toISOString(),

                })
                .eq("id", currentSessionId);

            if (sessionError) throw sessionError;

            // =========================
            // SUCCESS
            // =========================

            toast.success("Attendance saved successfully.");

            setHasChanges(false);

            onAttendanceSaved();

            onClose();


        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };


    const filteredStudents = useMemo(() => {

        if (!search.trim()) return students;

        const value = search.toLowerCase();

        return students.filter(student =>

            student.name.toLowerCase().includes(value) ||

            student.roll_number
                ?.toString()
                .includes(value)

        );

    }, [students, search]);

    const presentCount = useMemo(() => {

        return students.filter(
            s => s.attendanceStatus === "present"
        ).length;

    }, [students]);

    const absentCount = useMemo(() => {

        return students.filter(
            s => s.attendanceStatus === "absent"
        ).length;

    }, [students]);

    const leaveCount = useMemo(() => {

        return students.filter(
            s => s.attendanceStatus === "leave"
        ).length;

    }, [students]);

    const totalStudents = students.length;


    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50">

                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-xl flex flex-col">

                        {/* Header */}
                        <div className="flex items-center justify-between border-b px-6 py-4">
                            <div>
                                <h2 className="text-xl font-semibold">

                                    {sessionLocked
                                        ? "View Attendance"
                                        : "Take Attendance"}

                                </h2>
                                <p className="text-sm text-gray-500 mt-1">

                                    {sessionLocked
                                        ? "Attendance is locked"
                                        : "Mark attendance for selected batch"}

                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>


                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">

                            <div className="rounded-lg border p-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <GraduationCap className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Course
                                            </p>
                                            <p className="font-medium">
                                                {courseName || "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="h-5 w-5 text-green-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Batch
                                            </p>
                                            <p className="font-medium">
                                                {batchName || "-"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-orange-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Date
                                            </p>
                                            <p className="font-medium">
                                                {selectedDate}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Users className="h-5 w-5 text-purple-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Students
                                            </p>
                                            <p className="font-medium">
                                                {totalStudents}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="mt-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name or roll number..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-lg border pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>


                        <div className="grid grid-cols-4 gap-4 mt-6">
                            <div className="rounded-lg border p-4">
                                <p className="text-sm text-gray-500">
                                    Total
                                </p>
                                <p className="text-2xl font-bold">
                                    {totalStudents}
                                </p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    <p className="text-sm text-gray-500">
                                        Present
                                    </p>
                                </div>
                                <p className="text-2xl font-bold text-green-600 mt-2">
                                    {presentCount}
                                </p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center gap-2">
                                    <XCircle className="h-5 w-5 text-red-600" />
                                    <p className="text-sm text-gray-500">
                                        Absent
                                    </p>
                                </div>
                                <p className="text-2xl font-bold text-red-600 mt-2">
                                    {absentCount}
                                </p>
                            </div>
                            <div className="rounded-lg border p-4">
                                <div className="flex items-center gap-2">
                                    <Clock3 className="h-5 w-5 text-yellow-600" />
                                    <p className="text-sm text-gray-500">
                                        Leave
                                    </p>
                                </div>
                                <p className="text-2xl font-bold text-yellow-600 mt-2">
                                    {leaveCount}
                                </p>
                            </div>
                        </div>



                        {sessionLocked && (
                            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                                <p className="font-medium text-red-700">
                                    🔒 This attendance is locked.
                                </p>
                                <p className="text-sm text-red-600 mt-1">

                                    You can view attendance, but editing is disabled.
                                </p>
                            </div>
                        )}

                        {/* =========================
    STUDENTS LIST
========================= */}

                        <div className="mt-6 flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                </div>
                            ) : filteredStudents.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-10 text-center text-gray-500">
                                    No students found in this batch.
                                </div>

                            ) : (
                                <div className="space-y-3">
                                    {filteredStudents.map((student) => (
                                        <div
                                            key={student.id}
                                            className="rounded-lg border bg-white p-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Roll No.
                                                    </p>
                                                    <p className="font-semibold">
                                                        {student.roll_number ?? "-"}
                                                    </p>
                                                    <p className="mt-1 text-lg font-medium">
                                                        {student.name}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-6">

                                                    {/* Present */}
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name={`attendance-${student.id}`}
                                                            checked={
                                                                student.attendanceStatus === "present"
                                                            }
                                                            disabled={sessionLocked}
                                                            onChange={() =>
                                                                updateAttendanceStatus(
                                                                    student.id,
                                                                    "present"
                                                                )
                                                            }
                                                        />
                                                        <span className="text-green-600 font-medium">
                                                            Present
                                                        </span>
                                                    </label>

                                                    {/* Absent */}
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name={`attendance-${student.id}`}
                                                            checked={
                                                                student.attendanceStatus === "absent"
                                                            }
                                                            disabled={sessionLocked}
                                                            onChange={() =>
                                                                updateAttendanceStatus(
                                                                    student.id,
                                                                    "absent"
                                                                )
                                                            }
                                                        />
                                                        <span className="text-red-600 font-medium">
                                                            Absent
                                                        </span>
                                                    </label>

                                                    {/* Leave */}
                                                    <label className="flex items-center gap-2 cursor-pointer">

                                                        <input
                                                            type="radio"
                                                            name={`attendance-${student.id}`}
                                                            checked={
                                                                student.attendanceStatus === "leave"
                                                            }
                                                            disabled={sessionLocked}
                                                            onChange={() =>
                                                                updateAttendanceStatus(
                                                                    student.id,
                                                                    "leave"
                                                                )
                                                            }
                                                        />
                                                        <span className="text-yellow-600 font-medium">
                                                            Leave
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>



                        {/* footer */}
                        <div className="border-t px-6 py-4 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>

                            
                            <Button
                                onClick={saveAttendance}
                                disabled={saving || sessionLocked}
                            >
                                {sessionLocked
                                    ? "Attendance Locked"
                                    : saving
                                        ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        )
                                        : "Save Attendance"}
                            </Button>
                        </div>



                    </div>
                </div>
            )}
        </>

    )
};