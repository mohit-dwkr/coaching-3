import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";

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
import {
    Eye,
    Loader2,
    Lock,
} from "lucide-react";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AttendanceTableProps {
    refreshKey: number;
    selectedCourse: string;
    selectedBatch: string;
    selectedDate: string;

    onOpenAttendance: (
        session: AttendanceSessionRow
    ) => void;

    onDataLoaded?: (
        data: AttendanceSessionRow[]
    ) => void;
}


interface AttendanceSessionRow {
    id: string;
    attendance_date: string;
    course_id: string;
    batch_id: string;
    present_count: number;
    absent_count: number;
    leave_count: number;
    total_students: number;
    is_locked: boolean;
    course: {
        course_name: string;
    };
    batch: {
        batch_name: string;
    };
}


export default function AttendanceTable({
    refreshKey,
    selectedCourse,
    selectedBatch,
    selectedDate,
    onOpenAttendance,
    onDataLoaded,
}: AttendanceTableProps) {

    const [attendanceHistory, setAttendanceHistory] =
        useState<AttendanceSessionRow[]>([]);

    const [loading, setLoading] =
        useState(false);


    const fetchAttendanceHistory = async () => {
        try {
            setLoading(true);
            let query = supabase
                .from("Coaching-3_AttendanceSessions")
                .select(`
                id,
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

            if (selectedCourse) {
                query = query.eq("course_id", selectedCourse);
            }

            if (selectedBatch) {
                query = query.eq("batch_id", selectedBatch);
            }

            if (selectedDate) {
                query = query.eq(
                    "attendance_date",
                    selectedDate
                );
            }

            const { data, error } = await query;

            if (error) throw error;

            setAttendanceHistory(
                (data ?? []) as AttendanceSessionRow[]
            );

            onDataLoaded?.(
                (data ?? []) as AttendanceSessionRow[]
            );

        } catch (error: any) {

            toast.error(error.message);

        } finally {

            setLoading(false);

        }

    };


    const lockAttendance = async (
        sessionId: string
    ) => {
        try {
            const { error } = await supabase
                .from("Coaching-3_AttendanceSessions")
                .update({
                    is_locked: true,
                })
                .eq("id", sessionId);
            if (error) throw error;
            toast.success("Attendance locked.");
            fetchAttendanceHistory();
        } catch (error: any) {
            toast.error(error.message);
        }
    };


    useEffect(() => {
        fetchAttendanceHistory();
    }, [
        refreshKey,
        selectedCourse,
        selectedBatch,
        selectedDate,
    ]);


    if (loading) {
        return (
            <div className="rounded-xl border bg-white p-12 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }


    if (!attendanceHistory.length) {
        return (
            <div className="rounded-xl border bg-white p-12 text-center text-gray-500">
                Attendance history will appear here.
            </div>
        );
    }


    return (

        <div className="rounded-xl border bg-white overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead className="text-center">
                            Present
                        </TableHead>
                        <TableHead className="text-center">
                            Absent
                        </TableHead>
                        <TableHead className="text-center">
                            Leave
                        </TableHead>
                        <TableHead className="text-center">
                            Total
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attendanceHistory.map(session => (
                        <TableRow key={session.id}>
                            <TableCell>
                                {session.attendance_date}
                            </TableCell>
                            <TableCell>
                                {session.course.course_name}
                            </TableCell>
                            <TableCell>
                                {session.batch.batch_name}
                            </TableCell>
                            <TableCell className="text-center text-green-600 font-semibold">
                                {session.present_count}
                            </TableCell>
                            <TableCell className="text-center text-red-600 font-semibold">
                                {session.absent_count}
                            </TableCell>
                            <TableCell className="text-center text-yellow-600 font-semibold">
                                {session.leave_count}
                            </TableCell>
                            <TableCell className="text-center font-medium">
                                {session.total_students}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        session.is_locked
                                            ? "destructive"
                                            : "default"
                                    }
                                >
                                    {session.is_locked
                                        ? "Locked"
                                        : "Editable"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">


                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => onOpenAttendance(session)}
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            Open
                                        </Button>
                                        {!session.is_locked && (


                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                    >
                                                        <Lock className="mr-2 h-4 w-4" />
                                                        Lock
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Lock Attendance?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>

                                                            Once attendance is locked, it cannot be edited later.
                                                            Please make sure all attendance records are correct before locking.

                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() =>
                                                                lockAttendance(session.id)
                                                            }
                                                        >
                                                            Lock Attendance
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>


                                        )}
                                    </div>
                                </TableCell>

                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

    );
}