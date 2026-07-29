import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FeeStructureCards from "./FeeStructureCards";
import FeeStructureDrawer from "./FeeStructureDrawer";

import {
  CourseData,
  FeeStructure,
} from "./types";

interface FeeStructureSectionProps {
  searchQuery: string;
  refreshTrigger: number;
}

export default function FeeStructureSection({ searchQuery, refreshTrigger }: FeeStructureSectionProps) {
  const [structures, setStructures] = useState<FeeStructure[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Drawer States
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");


  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);


  const fetchCourses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("Coaching-3_Courses")
        .select("id, course_name")
        .order("course_name", { ascending: true });

      if (error) throw error;

      setCourses(data || []);
    } catch (err: any) {
      console.error("Course collection compilation drop:", err.message);
      toast.error("Failed to accurately map courses list metadata assets");
    }
  }, []);


  const fetchFeeStructures = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("Coaching-3_FeeStructures")
        .select(`
        id,
        course_id,
        total_fee,
        admission_fee,
        registration_fee,
        duration_months,
        status,
        created_at,
        updated_at,
        course:course_id (id, course_name)
      `);

      const { data: studentFees, error: studentFeesError } = await supabase
        .from("Coaching-3_StudentFees")
        .select("fee_structure_id");

      if (studentFeesError) throw studentFeesError;

      if (error) throw error;

      const structuresWithCount = (data || []).map((structure) => ({
        ...structure,
        assigned_students:
          studentFees?.filter(
            (fee) => fee.fee_structure_id === structure.id
          ).length || 0,
      }));

      setStructures(structuresWithCount);
    } catch (err: any) {
      toast.error(`Database core payload compilation error: ${err.message}`);
    }
  }, []);


  const refreshData = useCallback(async () => {
    setLoading(true);

    try {
      await Promise.all([
        fetchCourses(),
        fetchFeeStructures(),
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchCourses, fetchFeeStructures]);

  useEffect(() => {
    refreshData();
  }, [refreshData, refreshTrigger]);


  const handleCreateOpen = () => {
    setSelectedStructure(null);
    setDrawerOpen(true);
  };

  const handleEditOpen = (structure: FeeStructure) => {
    setSelectedStructure(structure);
    setDrawerOpen(true);
  };


  const handleToggleStatus = async (structure: FeeStructure) => {
    try {
      const newStatus =
        structure.status === "active"
          ? "inactive"
          : "active";

      const { error } = await supabase
        .from("Coaching-3_FeeStructures")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", structure.id);

      if (error) throw error;

      toast.success(
        `Fee structure ${newStatus === "active"
          ? "activated"
          : "deactivated"
        } successfully.`
      );

      await refreshData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };


  const handleDelete = async (id: string) => {

    const structure = structures.find((s) => s.id === id);

    if ((structure?.assigned_students ?? 0) > 0) {
      toast.error(
        "This fee structure is already assigned to students and cannot be deleted."
      );
      return;
    }

    try {
      const { error } = await supabase
        .from("Coaching-3_FeeStructures")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Fee structure deleted successfully");
      await refreshData();

    } catch (err: any) {
      toast.error(err.message);
    }
  };



  const handleSave = async (formData: Omit<FeeStructure, "id" | "course"> & { id?: string }) => {
    if (
      formData.duration_months < 1 ||
      formData.duration_months > 60
    ) {
      toast.error(
        "Course duration must be between 1 and 60 months."
      );
      return;
    }

    if (formData.total_fee <= 0) {
      toast.error("Total fee must be greater than zero.");
      return;
    }

    if (formData.admission_fee < 0) {
      toast.error("Admission fee cannot be negative.");
      return;
    }

    if (formData.registration_fee < 0) {
      toast.error("Registration fee cannot be negative.");
      return;
    }

    setSaving(true);
    try {
      if (formData.id) {
        // Update state logic execution block
        const { error } = await supabase
          .from("Coaching-3_FeeStructures")
          .update({
            course_id: formData.course_id,
            total_fee: formData.total_fee,
            admission_fee: formData.admission_fee,
            registration_fee: formData.registration_fee,
            duration_months: formData.duration_months,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq("id", formData.id);

        if (error) throw error;
        toast.success("Fee structure updated successfully.");
      } else {
        // Creation insertion logic block
        const { error } = await supabase
          .from("Coaching-3_FeeStructures")
          .insert([
            {
              course_id: formData.course_id,
              total_fee: formData.total_fee,
              admission_fee: formData.admission_fee,
              registration_fee: formData.registration_fee,
              duration_months: formData.duration_months,
              status: formData.status
            }
          ]);

        if (error) throw error;
        toast.success("Fee structure created successfully.");
      }
      setDrawerOpen(false);
      setSelectedStructure(null);

      await refreshData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };


  const totalCount = structures.length;

  const activeCount = structures.filter(
    (s) => s.status === "active"
  ).length;

  const inactiveCount = structures.filter(
    (s) => s.status === "inactive"
  ).length;


  const filteredStructures = structures.filter((item) => {
    const courseName = item.course?.course_name?.toLowerCase() || "";

    const matchesSearch = courseName.includes(
      searchQuery.toLowerCase()
    );

    const matchesStatus =
      statusFilter === "all" ||
      item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">Syncing structure schema values...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Fee Structures</h2>
          <p className="text-xs text-muted-foreground">Create and manage course fee structures.</p>
        </div>


        <div className="flex flex-wrap gap-2 mt-4">
          <Button
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            All ({totalCount})
          </Button>

          <Button
            variant={statusFilter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("active")}
          >
            Active ({activeCount})
          </Button>

          <Button
            variant={statusFilter === "inactive" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("inactive")}
          >
            Inactive ({inactiveCount})
          </Button>
        </div>


        <Button onClick={handleCreateOpen} size="sm" className="gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Create Structure
        </Button>
      </div>

      <FeeStructureCards
        items={filteredStructures}
        onEdit={handleEditOpen}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <FeeStructureDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSave={handleSave}
        structure={selectedStructure}
        courses={courses}
        saving={saving}
      />
    </div>
  );
}