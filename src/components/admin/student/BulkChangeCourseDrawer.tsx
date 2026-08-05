import { BookOpen, CheckCircle2, X } from "lucide-react";
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
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (isOpen) {
            fetchCourses();
            setSelectedCourse("");
        }
    }, [isOpen]);


    const fetchCourses = async () => {
    try {
        setIsLoading(true);

        const { data, error } = await supabase
            .from("Coaching-3_Courses")
            .select("*")
            .eq("status", "active")
            .order("course_name");

        if (error) throw error;

        setCourses(data ?? []);
    } catch (err: any) {
        toast.error(err.message);
    } finally {
        setIsLoading(false);
    }
};


    const changeBulkCourse = async () => {
        if (!students.length) {
            toast.error("No students selected.");
            return;
        }

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
            {/* Backdrop Overlay with Backdrop Blur */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
            />

            {/* Drawer Side Panel */}
            <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-slate-50 z-[70] shadow-2xl flex flex-col border-l border-slate-200 transition-transform duration-300 ease-in-out">

                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-white border-b border-slate-200/80 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                                Bulk Change Course
                            </h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-medium text-slate-400">
                                    Target Selection:
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200/60">
                                    {students.length} Students Selected
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                    >
                        <X size={18} />
                    </Button>
                </div>

                {/* Scrollable Body Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">

                    {/* Target Summary Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-600">
                                <CheckCircle2 size={18} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Selected Pool
                                </p>
                                <p className="text-sm font-extrabold text-slate-800">
                                    {students.length} {students.length === 1 ? "Student" : "Students"} Ready
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Course Selection Container */}
                    {isLoading ? (
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3 animate-pulse">
                            <div className="h-3 w-28 bg-slate-200 rounded"></div>
                            <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                            <label className="text-xs font-black uppercase tracking-widest text-slate-400 block">
                                Available Courses
                            </label>

                            <div className="relative">
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
                                >
                                    <option value="">Choose target course...</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.course_name}
                                        </option>
                                    ))}
                                </select>

                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <BookOpen size={18} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading && courses.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center space-y-2">
                            <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto text-slate-400">
                                <BookOpen size={24} />
                            </div>
                            <p className="font-extrabold text-slate-800 text-sm pt-1">
                                No Courses Available
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                                Please create courses in settings before updating student enrollments.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-5 bg-white border-t border-slate-200/80 shrink-0 flex gap-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 h-11 rounded-xl font-bold border-slate-200 hover:bg-slate-100 text-slate-700 transition-all"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={changeBulkCourse}
                        disabled={!selectedCourse || isLoading}
                        className="flex-1 h-11 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 disabled:shadow-none transition-all"
                    >
                        Change Course
                    </Button>
                </div>

            </div>
        </>
    );
}