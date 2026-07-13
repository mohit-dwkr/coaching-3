import React, { useState, useEffect } from 'react';
import { supabase } from "@/supabaseClient";
import StudentTable from "./student/StudentTable";
import StudentDrawer from "./student/StudentDrawer";
import {
  CheckCircle,
  Trash2,
  Users,
  Search,
  Phone,
  GraduationCap,
  UserPlus,
  RefreshCw,
  Mail,
  UserCheck,
  Clock,
  BookMarked,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const StudentManager = () => {
  // Data States
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "students" | "inactive">("pending");
  const [filterType, setFilterType] = useState<"All" | "Active" | "Inactive" | "Notes Enabled" | "Notes Disabled">("All");

  // Drawer State
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  // ================================
  // Data Fetching
  // ================================

  const fetchPendingRequests = async () => {
    const { data, error } = await supabase
      .from("Coaching-3_StudentApprovals")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) throw error;
    setPendingRequests(data || []);
  };

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("Coaching-3_Students")
      .select("*")
      .order("student_id", { ascending: true });

    if (error) throw error;
    setStudents(data || []);
  };

  const fetchAllData = async (showRefreshSpinner = false) => {
    try {
      if (showRefreshSpinner) setIsRefreshing(true);
      else setLoading(true);

      await Promise.all([fetchPendingRequests(), fetchStudents()]);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ================================
  // Core Actions (Unchanged Logic)
  // ================================
  const approveStudent = async (id: string) => {
    try {
      // STEP 1 -> Approval Request Fetch
      const { data: approval, error: approvalError } = await supabase
        .from("Coaching-3_StudentApprovals")
        .select("*")
        .eq("id", id)
        .single();

      if (approvalError || !approval) throw new Error("Student request not found");
      if (approval.status === "approved") {
        toast.error("Student is already approved");
        return;
      }

      // STEP 2 -> Check Student Exists
      const { data: existingStudent } = await supabase
        .from("Coaching-3_Students")
        .select("*")
        .eq("user_id", approval.user_id)
        .maybeSingle();

      // ==========================
      // NEW STUDENT
      // ==========================
      if (!existingStudent) {
        // Last Student ID
        const { data: lastStudent } = await supabase
          .from("Coaching-3_Students")
          .select("student_id")
          .order("id", { ascending: false })
          .limit(1)
          .maybeSingle();

        let nextNumber = 1;
        if (lastStudent?.student_id) {
          const last = parseInt(lastStudent.student_id.split("-")[2]) || 0;
          nextNumber = last + 1;
        }

        const studentId = `STU-${new Date().getFullYear()}-${String(nextNumber).padStart(3, "0")}`;

        // Insert Student
        const { error: insertError } = await supabase
          .from("Coaching-3_Students")
          .insert({
            student_id: studentId,
            user_id: approval.user_id,
            name: approval.name,
            email: approval.email,
            mobile: approval.mobile,
            class: approval.class,
            batch: "Not Assigned",
            status: "active",
            notes_access: true,
            joined_at: new Date().toISOString().split("T")[0],
            updated_at: new Date().toISOString(),
          });

        if (insertError) throw insertError;
      }
      // ==========================
      // EXISTING STUDENT
      // ==========================
      else {
        const { error: updateStudentError } = await supabase
          .from("Coaching-3_Students")
          .update({
            name: approval.name,
            email: approval.email,
            mobile: approval.mobile,
            class: approval.class,
            status: "active",
            notes_access: true,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", approval.user_id);

        if (updateStudentError) throw updateStudentError;
      }

      // ==========================
      // APPROVAL STATUS
      // ==========================
      const { error: approveError } = await supabase
        .from("Coaching-3_StudentApprovals")
        .update({
          status: "approved",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (approveError) throw approveError;

      // ==========================
      // Refresh Lists
      // ==========================
      await fetchPendingRequests();
      await fetchAllData();

      toast.success("Student Approved");
    } catch (err: any) {
      toast.error(err.message);
    }
  };


  const rejectRequest = async (id: string) => {

    if (!window.confirm("Reject this admission request?"))
      return;

    try {

      const { error } = await supabase
        .from("Coaching-3_StudentApprovals")
        .update({
          status: "denied",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      await fetchPendingRequests();

      toast.success("Request rejected.");

    } catch (err: any) {

      toast.error(err.message);

    }

  };


  const disableNotesAccess = async (id: string) => {

    if (!window.confirm("Are you sure? This will disable study material access for this student."))
      return;

    try {

      const { error } = await supabase
        .from("Coaching-3_Students")
        .update({
          notes_access: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      await fetchStudents();

      toast.success("Study material access disabled.");

      if (isDrawerOpen)
        closeStudentDrawer();

    } catch (err: any) {

      toast.error(err.message);

    }

  };


  const toggleNotesAccess = async (student: any) => {

    try {

      const newValue = !student.notes_access;

      const { error } = await supabase
        .from("Coaching-3_Students")
        .update({
          notes_access: newValue,
          updated_at: new Date().toISOString(),
        })
        .eq("id", student.id);

      if (error) throw error;

      await fetchStudents();

      toast.success(
        newValue
          ? "Study Material Enabled"
          : "Study Material Disabled"
      );

    } catch (err: any) {

      toast.error(err.message);

    }

  };


  const deactivateStudent = async (student: any) => {

    if (
      !window.confirm(
        "Deactivate this student?\n\nThe student will become inactive and study material access will be disabled."
      )
    )
      return;

    try {

      const { error } = await supabase
        .from("Coaching-3_Students")
        .update({

          status: "inactive",

          notes_access: false,

          updated_at: new Date().toISOString(),

        })
        .eq("id", student.id);

      if (error) throw error;

      await fetchStudents();

      setIsDrawerOpen(false);

      toast.success("Student deactivated.");

    } catch (err: any) {

      toast.error(err.message);

    }

  };


  const activateStudent = async (student: any) => {

    if (
      !window.confirm(
        "Activate this student?\n\nStudy material access will be restored."
      )
    )
      return;

    try {

      const { error } = await supabase
        .from("Coaching-3_Students")
        .update({
          status: "active",
          notes_access: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", student.id);

      if (error) throw error;

      await fetchStudents();

      setSelectedStudent(null);
      setIsDrawerOpen(false);

      toast.success("Student activated.");

    } catch (err: any) {

      toast.error(err.message);

    }

  };

  // ================================
  // Search, Filters & Stats
  // ================================
  const handleComingSoon = (feature: string) => {
    toast.info(`${feature} module coming soon!`);
  };

  const openStudentDrawer = (student: any) => {
    setSelectedStudent(student);
    setIsDrawerOpen(true);
  };

  const closeStudentDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedStudent(null), 300);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const filteredPending = pendingRequests.filter((s) =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.mobile?.includes(searchTerm) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.class?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const filteredStudents = students.filter((s) => {

    // ✅ Students tab me sirf active students dikhenge
    if (s.status !== "active") return false;

    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.mobile?.includes(searchTerm) ||
      s.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.batch?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "Notes Enabled")
      return s.notes_access === true;

    if (filterType === "Notes Disabled")
      return s.notes_access === false;

    return true;
  });


  const inactiveStudents = students.filter((s) => {

    if (s.status !== "inactive") return false;

    const matchesSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.mobile?.includes(searchTerm) ||
      s.student_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.batch?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;

  });


  // Statistics
  const stats = {
    total: students.length,
    active: students.filter(s => s.status === "active").length,
    pending: pendingRequests.length,
    notesEnabled: students.filter(s => s.notes_access).length
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-6 md:p-8 rounded-[24px] shadow-sm border border-slate-200/60">
          <div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <Users className="text-blue-600" size={36} strokeWidth={2.5} />
              Student Manager
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base mt-2">Centralized command center for enrollments and student profiles.</p>
          </div>

          <div className="flex flex-col sm:flex-row w-full xl:w-auto items-stretch sm:items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Search ID, Name, Phone, Batch..."
                className="pl-11 bg-slate-50 border-slate-200 h-12 rounded-2xl focus-visible:ring-blue-600 text-[15px] font-medium shadow-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                onClick={() => fetchAllData(true)}
                variant="outline"
                className="h-12 px-4 rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-600 shadow-sm transition-all"
              >
                <RefreshCw size={18} className={isRefreshing ? "animate-spin text-blue-600" : ""} />
              </Button>
              <Button
                // onClick={() => handleComingSoon("Manual Admission")} 
                className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl h-12 px-6 shadow-sm transition-all"
              >
                <UserPlus size={18} className="mr-2" /> Admission <span className="ml-2 px-2 py-0.5 bg-white/20 rounded text-[10px] uppercase font-black tracking-wider">Open</span>
              </Button>
            </div>
          </div>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Students</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{stats.total}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Active Students</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{stats.active}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
              <Clock size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pending Logins</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{stats.pending}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
            <div className="h-14 w-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookMarked size={28} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Notes Enabled</p>
              <h3 className="text-3xl font-black text-slate-900 leading-none">{stats.notesEnabled}</h3>
            </div>
          </div>
        </div>

        {/* ================= TABS ================= */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200/60 shadow-sm inline-flex flex-wrap sm:flex-nowrap gap-1 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[15px] font-bold transition-all flex items-center justify-center gap-3 ${activeTab === "pending" ? "bg-orange-50 text-orange-700 shadow-sm border border-orange-100" : "text-slate-500 hover:bg-slate-50"
              }`}
          >
            Pending Requests
            <span className={`px-2.5 py-0.5 rounded-md text-xs ${activeTab === 'pending' ? 'bg-orange-200/70' : 'bg-slate-200 text-slate-700'}`}>
              {filteredPending.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("students")}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[15px] font-bold transition-all flex items-center justify-center gap-3 ${activeTab === "students" ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" : "text-slate-500 hover:bg-slate-50"
              }`}
          >
            Students
            <span className={`px-2.5 py-0.5 rounded-md text-xs ${activeTab === 'students' ? 'bg-blue-200/70' : 'bg-slate-200 text-slate-700'}`}>
              {filteredStudents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("inactive")}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-[15px] font-bold transition-all flex items-center justify-center gap-3 ${activeTab === "inactive" ? "bg-slate-100 text-slate-800 shadow-sm border border-slate-200" : "text-slate-500 hover:bg-slate-50"
              }`}
          >
            Inactive
            <span className={`px-2.5 py-0.5 rounded-md text-xs ${activeTab === 'inactive' ? 'bg-slate-300' : 'bg-slate-200 text-slate-700'}`}>
              {inactiveStudents.length}
            </span>
          </button>
        </div>

        {/* ================= LOADING STATE ================= */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white h-48 rounded-[24px] border border-slate-200"></div>
            ))}
          </div>
        ) : (
          <>
            {/* ================= TAB CONTENT: PENDING ================= */}
            {activeTab === "pending" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPending.length === 0 ? (
                  <div className="col-span-full bg-white p-16 rounded-[32px] border border-dashed border-slate-300 text-center flex flex-col items-center justify-center">
                    <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="text-green-500" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800">All Caught Up!</h3>
                    <p className="text-slate-500 text-base mt-2 font-medium">No pending student requests to review.</p>
                  </div>
                ) : (
                  filteredPending.map(s => (
                    <div key={s.id} className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all group flex flex-col h-full">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-black text-lg">
                            {getInitials(s.name)}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">{s.name}</p>
                            <span className="px-2.5 py-0.5 bg-orange-50 text-orange-600 rounded-md text-[11px] font-black uppercase mt-1.5 inline-block border border-orange-100">
                              New Request
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-8 flex-1">
                        <div className="flex items-center gap-3 text-slate-600 text-sm font-medium bg-slate-50 p-2.5 rounded-xl">
                          <Phone size={16} className="text-slate-400" /> {s.mobile}
                        </div>
                        {s.email && (
                          <div className="flex items-center gap-3 text-slate-600 text-sm font-medium bg-slate-50 p-2.5 rounded-xl truncate">
                            <Mail size={16} className="text-slate-400 min-w-4" /> <span className="truncate">{s.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-slate-600 text-sm font-medium bg-slate-50 p-2.5 rounded-xl">
                          <GraduationCap size={16} className="text-slate-400" /> Class {s.class}
                        </div>
                      </div>

                      <div className="flex gap-3 mt-auto">
                        <Button onClick={() => approveStudent(s.id)} className="flex-1 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl h-12 transition-colors">
                          Approve
                        </Button>
                        <Button onClick={() => rejectRequest(s.id)} variant="outline" className="border-slate-200 text-red-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 rounded-xl h-12 px-4">
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}



            {/* ================= TAB CONTENT: STUDENTS ================= */}
            {activeTab === "students" && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 mr-4 text-slate-400 text-sm font-bold uppercase tracking-wider">
                    <Filter size={16} /> Filters:
                  </div>

                  {["All", "Notes Enabled", "Notes Disabled"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setFilterType(filter as any)}
                      className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${filterType === filter
                        ? "bg-slate-800 text-white border-slate-800"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <StudentTable
                  students={filteredStudents}
                  openStudentDrawer={openStudentDrawer}
                  toggleNotesAccess={toggleNotesAccess}
                  getInitials={getInitials}
                />
              </div>
            )}



            {/* ================= TAB CONTENT: INACTIVE ================= */}
            {activeTab === "inactive" && (
              <div className="space-y-6">

                <StudentTable
                  students={inactiveStudents}
                  openStudentDrawer={openStudentDrawer}
                  toggleNotesAccess={toggleNotesAccess}
                  getInitials={getInitials}
                  inactive
                />
              </div>
            )}
          </>
        )}
      </div>


      <StudentDrawer
        student={selectedStudent}
        isOpen={isDrawerOpen}
        onClose={closeStudentDrawer}
        getInitials={getInitials}
        deactivateStudent={deactivateStudent}
        activateStudent={activateStudent}
        handleComingSoon={handleComingSoon}
      />

    </div>
  );
};

export default StudentManager;