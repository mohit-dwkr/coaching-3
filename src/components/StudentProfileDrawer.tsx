import { AnimatePresence, motion } from "framer-motion";

import {
  Edit3,
  Save,
  X,
  LogOut,
  User,
} from "lucide-react";

import { supabase } from "@/supabaseClient";

interface StudentProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;

  profile: any;
  status: string | null;

  studentId: string;
  batch: string;

  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;

  editData: any;
  setEditData: React.Dispatch<React.SetStateAction<any>>;

  saving: boolean;

  handleUpdateProfile: () => void;
}

export default function StudentProfileDrawer({
  isOpen,
  onClose,

  profile,
  status,

  studentId,
  batch,

  isEditing,
  setIsEditing,

  editData,
  setEditData,

  saving,

  handleUpdateProfile,
}: StudentProfileDrawerProps) {

return (
  <>
    {/* --- SIDE PROFILE DRAWER --- */}
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[60] transition-opacity"
          />

          {/* Side Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-[90%] max-w-md bg-slate-900 text-slate-100 z-[70] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-y-auto flex flex-col justify-between border-l border-slate-800/80 font-sans selection:bg-indigo-500 selection:text-white"
          >
            <div>
              {/* Header Banner with Premium Gradient & Neon Accents */}
              <div className="relative overflow-hidden bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-900 p-6 pt-2 border-b border-slate-800/60">
                {/* Background Ambient Glows */}
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -top-20 -left-20 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

                {/* Top Navigation Row */}
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 backdrop-blur-md">
                    <User size={16} className="text-indigo-400" />
                    <span className="font-extrabold text-xs uppercase tracking-widest bg-gradient-to-r from-indigo-200 to-blue-200 bg-clip-text text-transparent">
                      Your Profile
                    </span>
                  </div>
                  <button
                    onClick={onClose}
                    className="h-9 w-9 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 flex items-center justify-center text-slate-300 hover:text-white transition-all duration-200 active:scale-95"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Profile Card & Avatar */}
                <div className="mt-8 flex flex-col items-center relative z-10">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-violet-500 p-[2px] shadow-xl shadow-indigo-500/20">
                      <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center text-indigo-200 text-3xl font-black tracking-tight">
                        {profile?.name?.charAt(0) || "S"}
                      </div>
                    </div>
                    {/* Status Dot Ring */}
                    <span
                      className={`absolute bottom-0 right-0 h-5 w-5 rounded-full ring-4 ring-slate-900 ${
                        status === "approved"
                          ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                          : "bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]"
                      }`}
                    />
                  </div>

                  {/* Status Tag Badge */}
                  <div className="mt-4">
                    <span
                      className={`px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border backdrop-blur-xl transition-all ${
                        status === "approved"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              </div>


              {/* Main Content Sections */}
              <div className="p-6 space-y-6">
                {/* Personal Info Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400/90">
                      Personal Information
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { label: "Full Name", key: "name" },
                      { label: "Contact Email", key: "email" },
                      { label: "Mobile Number", key: "mobile" },
                    ].map((field) => (
                      <div
                        key={field.key}
                        className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800/90 hover:border-slate-700/80 transition-all duration-200 group"
                      >
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 group-hover:text-slate-400 transition-colors">
                          {field.label}
                        </p>

                        {isEditing && field.key !== "email" ? (
                          <input
                            type={field.key === "class" ? "number" : "text"}
                            value={editData[field.key as keyof typeof editData]}
                            onChange={(e) =>
                              setEditData({ ...editData, [field.key]: e.target.value })
                            }
                            className="w-full bg-slate-900 border border-indigo-500/50 rounded-xl px-3.5 py-2 text-sm font-semibold text-white outline-none focus:ring-2 ring-indigo-500/30 transition-all shadow-inner"
                          />
                        ) : (
                          <p
                            className={`text-sm font-semibold truncate ${
                              field.key === "email" && isEditing
                                ? "text-slate-600"
                                : "text-slate-200"
                            }`}
                          >
                            {profile?.[field.key] || "Not Set"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic Details Section */}
                <div className="space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400/90">
                    Academic Details
                  </span>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Student ID */}
                    <div className="rounded-2xl bg-slate-800/40 border border-slate-800/90 p-3.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Student ID
                      </p>
                      <p className="text-sm font-black text-slate-100 mt-1 truncate">
                        {profile?.student_id || "-"}
                      </p>
                    </div>

                    {/* Roll Number */}
                    <div className="rounded-2xl bg-slate-800/40 border border-slate-800/90 p-3.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Roll Number
                      </p>
                      <p className="text-sm font-black text-slate-100 mt-1 truncate">
                        {profile?.roll_number ?? "-"}
                      </p>
                    </div>
                  </div>

                  {/* Course Details */}
                  <div className="rounded-2xl bg-slate-800/40 border border-slate-800/90 p-3.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Enrolled Course
                    </p>
                    <p className="text-sm font-bold text-slate-100 mt-1">
                      {profile?.course?.course_name || "-"}
                    </p>
                  </div>

                  {/* Batch Details */}
                  <div className="rounded-2xl bg-slate-800/40 border border-slate-800/90 p-3.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Batch Assigned
                    </p>
                    <p className="text-sm font-bold text-slate-100 mt-1">
                      {profile?.batch?.batch_name || "-"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Account Status */}
                    <div className="rounded-2xl bg-slate-800/40 border border-slate-800/90 p-3.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Account Status
                      </p>
                      <p className="text-sm font-bold text-slate-100 mt-1 capitalize">
                        {profile?.status || "-"}
                      </p>
                    </div>

                    {/* Joined Date */}
                    <div className="rounded-2xl bg-slate-800/40 border border-slate-800/90 p-3.5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Registration Date
                      </p>
                      <p className="text-xs font-bold text-slate-100 mt-1.5 truncate">
                        {profile?.joined_at
                          ? new Date(profile.joined_at).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Section */}
            <div className="p-6 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-xl space-y-3">
              {isEditing ? (
                <div className="space-y-2">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={saving}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all duration-200 active:scale-[0.98]"
                  >
                    <Save size={16} />
                    {saving ? "Saving Changes..." : "Save Profile Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setEditData({
                        name: profile?.name || "",
                        mobile: profile?.mobile || "",
                      });
                      setIsEditing(false);
                    }}
                    className="w-full py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-indigo-200 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
              )}

              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/userlogin";
                }}
                className="w-full py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
              >
                <LogOut size={16} /> Logout Account
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </>
);

}