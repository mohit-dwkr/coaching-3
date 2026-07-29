import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import CourseDrawer from "./CourseDrawer";
import CourseTable from "./CourseTable";
import { toast } from "sonner";


interface CourseSectionProps {
  onUpdated: () => void;
}

export default function CourseSection({
  onUpdated,
}: CourseSectionProps) {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
const [selectedCourse, setSelectedCourse] = useState<any>(null);

const fetchCourses = async () => {

  // 1. Courses
  const { data: courses, error: courseError } = await supabase
    .from("Coaching-3_Courses")
    .select("*")
    .order("course_name");

  if (courseError) return;

  // 2. Batches
  const { data: batches } = await supabase
    .from("Coaching-3_StudentBatches")
    .select("course_id");

  // 3. Students
  const { data: students } = await supabase
    .from("Coaching-3_Students")
    .select("course_id");

  const finalCourses = courses.map((course) => {

    const batchCount =
      batches?.filter(
        b => b.course_id === course.id
      ).length || 0;

    const studentCount =
      students?.filter(
        s => s.course_id === course.id
      ).length || 0;

    return {
      ...course,
      batchCount,
      studentCount,
    };

  });

  setCourses(finalCourses);
   onUpdated();

};

useEffect(() => {
  fetchCourses();
}, []);


const deleteCourse = async (course: any) => {

  if (course.batchCount > 0) {
    toast.error(
      "Cannot delete course. Remove all batches first."
    );
    return;
  }

  if (course.studentCount > 0) {
    toast.error(
      "Cannot delete course. Students are still enrolled."
    );
    return;
  }

  if (
    !window.confirm(
      `Delete "${course.course_name}" ?`
    )
  ) {
    return;
  }

  const { error } = await supabase
    .from("Coaching-3_Courses")
    .delete()
    .eq("id", course.id);

  if (error) {
    toast.error(error.message);
    return;
  }

  toast.success("Course deleted.");

 await fetchCourses();

};


  return (
    <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-8 border-b border-slate-100">

        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Courses
          </h2>

          <p className="text-slate-500 mt-1">
            Manage all available courses for your coaching institute.
          </p>
        </div>

        <Button onClick={() => setIsDrawerOpen(true)} className="h-12 px-6 rounded-xl font-bold">
          <Plus size={18} className="mr-2" />
          Add Course
        </Button>

      </div>


<CourseTable
  courses={courses}
  onEdit={(course) => {
    setSelectedCourse(course);
    setIsDrawerOpen(true);
  }}
  onDelete={deleteCourse}
/>


      {/* Empty State */}

      {/* <div className="flex flex-col items-center justify-center py-20 px-8">

        <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
          <BookOpen size={36} className="text-slate-400" />
        </div>

        <h3 className="text-2xl font-black text-slate-900">
          No Courses Yet
        </h3>

        <p className="text-slate-500 mt-3 text-center max-w-lg">
          Create your first course before creating batches, assigning students,
          uploading study material, or sending notifications.
        </p>

        <Button onClick={() => setIsDrawerOpen(true)} className="mt-8 h-12 px-6 rounded-xl font-bold">
          <Plus size={18} className="mr-2" />
          Create First Course
        </Button>

      </div> */}
      
<CourseDrawer
    isOpen={isDrawerOpen}
    onClose={() => {
        setIsDrawerOpen(false);
        setSelectedCourse(null);
    }}
    onCourseCreated={fetchCourses}
    selectedCourse={selectedCourse}
/>
    </div>
    
  );
}