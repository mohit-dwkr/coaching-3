export interface AttendanceSession {
    id: string;

    course_id: string;
    batch_id: string;

    attendance_date: string;

    taken_by: string | null;

    remarks: string | null;

    is_locked: boolean;

    created_at: string;
    updated_at: string;
}

export interface AttendanceRecord {
    id: string;

    session_id: string;

    student_id: string;

    roll_number: number | null;

    status: "present" | "absent" | "leave";

    remarks: string | null;

    created_at: string;
    updated_at: string;
}