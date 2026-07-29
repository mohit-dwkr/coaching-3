import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";

interface CourseDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onCourseCreated: () => void;
    selectedCourse: any;
}

export default function CourseDrawer({
    isOpen,
    onClose,
    onCourseCreated,
    selectedCourse,
}: CourseDrawerProps) {

    const [courseName, setCourseName] = useState("");
    const [description, setDescription] = useState("");


  const saveCourse = async () => {

  if (!courseName.trim()) {
    toast.error("Course name is required.");
    return;
  }

  try {

    if (selectedCourse) {

      // UPDATE

      const { error } = await supabase
        .from("Coaching-3_Courses")
        .update({
          course_name: courseName.trim(),
          description: description.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedCourse.id);

      if (error) throw error;

      toast.success("Course updated successfully.");

    } else {

      // CREATE

      const { error } = await supabase
        .from("Coaching-3_Courses")
        .insert({
          course_name: courseName.trim(),
          description: description.trim(),
          status: "active",
        });

      if (error) throw error;

      toast.success("Course created successfully.");

    }

    setCourseName("");
    setDescription("");

    onCourseCreated();

    onClose();

  } catch (err: any) {

    toast.error(err.message);

  }

};


    useEffect(() => {

        if (selectedCourse) {

            setCourseName(selectedCourse.course_name || "");

            setDescription(selectedCourse.description || "");

        } else {

            setCourseName("");

            setDescription("");

        }

    }, [selectedCourse]);


    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                    }`}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen
                    ? "translate-x-0"
                    : "translate-x-full"
                    }`}
            >

                {/* Header */}

                <div className="flex items-center justify-between p-6 border-b border-slate-200">

                    <div>

                        <h2 className="text-2xl font-black">
                            {selectedCourse ? "Edit Course" : "Create Course"}
                        </h2>

                        <p className="text-slate-500 text-sm mt-1">
                            {selectedCourse
                                ? "Update course information."
                                : "Add a new course for your coaching institute."}
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Body */}

                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    <div>

                        <label className="text-sm font-bold">
                            Course Name
                        </label>

                        <Input
                            value={courseName}
                            onChange={(e) =>
                                setCourseName(e.target.value)
                            }
                            placeholder="Example : Class 10"
                            className="mt-2 h-12"
                        />

                    </div>

                    <div>

                        <label className="text-sm font-bold">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            rows={5}
                            placeholder="Optional"
                            className="w-full mt-2 rounded-xl border border-slate-300 p-3"
                        />

                    </div>

                </div>

                {/* Footer */}

                <div className="border-t border-slate-200 p-6">

                    <Button
                        onClick={saveCourse}
                        className="w-full h-12 rounded-xl font-bold"
                    >
                        {selectedCourse ? "Update Course" : "Create Course"}
                    </Button>

                </div>

            </div>
        </>
    );
}