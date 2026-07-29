import { supabase } from "@/supabaseClient";

export const generateStudentId = async () => {

    const { data: lastStudent } = await supabase
        .from("Coaching-3_Students")
        .select("student_id")
        .order("id", { ascending: false })
        .limit(1)
        .maybeSingle();

    let nextNumber = 1;

    if (lastStudent?.student_id) {

        const last =
            parseInt(
                lastStudent.student_id.split("-")[2]
            ) || 0;

        nextNumber = last + 1;

    }

    return `STU-${new Date().getFullYear()}-${String(nextNumber).padStart(3, "0")}`;

};