import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import CourseSection from "./CourseSection";
import BatchSection from "./BatchSection";

export default function BatchManager() {
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBatches: 0,
    activeBatches: 0,
    assignedStudents: 0,
    unassignedStudents: 0,
  });

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from("Coaching-3_Courses")
      .select("*")
      .order("course_name");

    if (!error && data) {
      setCourses(data);
    }
  };


  const fetchStats = async () => {
    try {

      // Total Batches
      const { count: totalBatches } = await supabase
        .from("Coaching-3_StudentBatches")
        .select("*", { count: "exact", head: true });

      // Active Batches
      const { count: activeBatches } = await supabase
        .from("Coaching-3_StudentBatches")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

      // Assigned Students
      const { count: assignedStudents } = await supabase
        .from("Coaching-3_Students")
        .select("*", { count: "exact", head: true })
        .not("batch_id", "is", null);

      // Unassigned Students
      const { count: unassignedStudents } = await supabase
        .from("Coaching-3_Students")
        .select("*", { count: "exact", head: true })
        .is("batch_id", null);

      setStats({
        totalBatches: totalBatches || 0,
        activeBatches: activeBatches || 0,
        assignedStudents: assignedStudents || 0,
        unassignedStudents: unassignedStudents || 0,
      });

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchStats();
  }, []);


  const refreshBatchManager = async () => {
    await fetchCourses();
    await fetchStats();
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900">
          Batch Manager
        </h1>
        <p className="text-slate-500 mt-2">
          Manage student batches and assignments.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-bold text-slate-500">
            Total Batches
          </p>
          <h2 className="text-3xl font-black mt-2"> {stats.totalBatches}</h2>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-bold text-slate-500">
            Active Batches
          </p>
          <h2 className="text-3xl font-black mt-2"> {stats.activeBatches}</h2>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-bold text-slate-500">
            Assigned Students
          </p>
          <h2 className="text-3xl font-black mt-2"> {stats.assignedStudents}</h2>
        </div>

        <div className="bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm">
          <p className="text-sm font-bold text-slate-500">
            Unassigned Students
          </p>
          <h2 className="text-3xl font-black mt-2">  {stats.unassignedStudents}</h2>
        </div>
      </div>

      <CourseSection
        onUpdated={refreshBatchManager}
      />

      <BatchSection
        onUpdated={refreshBatchManager}
      />
      
    </div>
  );
}