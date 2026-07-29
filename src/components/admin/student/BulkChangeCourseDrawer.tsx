import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { updateBatchStudentCount } from "@/utils/batchUtils";
import { toast } from "sonner";

interface BulkChangeCourseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    students: any[];
    onUpdated: () => void;
}

export default function BulkChangeCourseDrawer({
    isOpen,
    onClose,
    students,
    onUpdated,
}: BulkChangeCourseDrawerProps) {

    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState("");

    useEffect(() => {
        if (isOpen) {
            fetchCourses();
            setSelectedCourse("");
        }
    }, [isOpen]);

    const fetchCourses = async () => {

        const { data, error } = await supabase
            .from("Coaching-3_Courses")
            .select("*")
            .eq("status", "active")
            .order("course_name");

        if (!error && data) {
            setCourses(data);
        }

    };

    const changeBulkCourse = async () => {

        if (!selectedCourse) {
            toast.error("Please select a course.");
            return;
        }

        const allSameCourse = students.every(
            student => student.course_id === selectedCourse
        );

        if (allSameCourse) {
            toast.info("Selected students are already in this course.");
            return;
        }

        const oldBatchIds = [
            ...new Set(
                students
                    .map(student => student.batch_id)
                    .filter(Boolean)
            ),
        ];

        try {

            for (const student of students) {

                // Update Students Table

                const { error: studentError } = await supabase
                    .from("Coaching-3_Students")
                    .update({
                        course_id: selectedCourse,

                        batch_id: null,
                        batch: "Not Assigned",
                        roll_number: null,

                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", student.id);

                if (studentError) throw studentError;

                // Update Approval Table

                const { error: approvalError } = await supabase
                    .from("Coaching-3_StudentApprovals")
                    .update({
                        course_id: selectedCourse,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("user_id", student.user_id);

                if (approvalError) throw approvalError;
            }

            // Update old batch counts

            for (const batchId of oldBatchIds) {
                await updateBatchStudentCount(batchId);
            }

            toast.success("Course updated successfully.");

            onUpdated();

            onClose();

        } catch (err: any) {
            toast.error(err.message);
        }

    };

    if (!isOpen) return null;

    return (
        <>
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/40 z-40"
            />

            <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-50 shadow-xl flex flex-col">

                <div className="flex items-center justify-between p-6 border-b">

                    <div>

                        <h2 className="text-2xl font-black">
                            Bulk Change Course
                        </h2>

                        <p className="text-slate-500 text-sm mt-1">
                            Selected Students : {students.length}
                        </p>

                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </Button>

                </div>

                <div className="flex-1 p-6">

                    <p className="font-bold mb-4">
                        Available Courses
                    </p>

                    <div>

                        <label className="text-sm font-bold text-slate-700 block mb-2">
                            Select Course
                        </label>

                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full border rounded-xl p-3"
                        >

                            <option value="">
                                Choose Course
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

                </div>

                <Button
                    onClick={changeBulkCourse}
                    className="w-full"
                >
                    Change Course
                </Button>

            </div>
        </>
    );
}