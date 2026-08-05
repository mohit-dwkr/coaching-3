import { supabase } from "@/supabaseClient";

export interface DashboardData {

    attendance: {
        present: number;
        absent: number;
        leave: number;
        total: number;
        percentage: number;
        todayStatus: string;
    }

    fees: {

        totalFee: number;
        paid: number;
        remaining: number;
        status: string;
        nextDueDate: string | null;

    };

    notes: {

        total: number;

    };

    notifications: {

        total: number;

    };

}

export async function getStudentDashboardData(
    studentId: number
): Promise<DashboardData> {


    const {
        data: fee,
        error: feeError,
    } = await supabase
        .from("Coaching-3_StudentFees")
        .select("*")
        .eq("student_id", studentId)
        .maybeSingle();




    const {
        data: attendance,
        error: attendanceError,
    } = await supabase
        .from("Coaching-3_AttendanceRecords")
        .select(`
        status,
        session:Coaching-3_AttendanceSessions!attendance_records_session_fk(
            attendance_date
        )
    `)
        .eq("student_id", studentId);


    const today = new Date().toISOString().split("T")[0];
    const todayAttendance = attendance?.find(
        (item: any) =>
            item.session?.attendance_date === today
    );
    const todayStatus =
        todayAttendance?.status || "Not Marked";


    const present =
        attendance?.filter(
            (item) => item.status === "present"
        ).length || 0;

    const absent =
        attendance?.filter(
            (item) => item.status === "absent"
        ).length || 0;

    const leave =
        attendance?.filter(
            (item) => item.status?.toLowerCase() === "leave"
        ).length || 0;

    const total = attendance?.length || 0;

    const percentage =
        total === 0
            ? 0
            : Math.round((present / total) * 100);



    return {
        attendance: {
            present,
            absent,
            leave,
            total,
            percentage,
            todayStatus,
        },

        fees: {

            totalFee: Number(fee?.final_fee ?? 0),

            paid: Number(fee?.paid_amount ?? 0),

            remaining: Number(fee?.remaining_amount ?? 0),

            status: fee?.status ?? "Pending",

            nextDueDate: fee?.next_due_date ?? null,

        },

        notes: {

            total: 0,

        },

        notifications: {

            total: 0,

        },

    };
}