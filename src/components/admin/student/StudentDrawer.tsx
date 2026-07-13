import { Button } from "@/components/ui/button";

import {
    X,
    UserCheck,
    ShieldCheck,
    ShieldX,
    Briefcase,
  CreditCard,
  Calendar,
  Activity,
  Users,
} from "lucide-react";

interface StudentDrawerProps {
    student: any;
    isOpen: boolean;
    onClose: () => void;

    getInitials: (name: string) => string;
    handleComingSoon: (feature: string) => void;
    deactivateStudent: (student: any) => void;
    activateStudent: (student: any) => void;
}


export default function StudentDrawer({
    student,
    isOpen,
    onClose,
    getInitials,
    deactivateStudent,
    activateStudent,
    handleComingSoon,
}: StudentDrawerProps) {
    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />


            {/* Drawer Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[500px] xl:w-[600px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {student && (
                    <>
                        {/* Drawer Header */}
                        <div className="flex items-start justify-between p-6 xl:p-8 border-b border-slate-100 bg-slate-50/50 relative overflow-hidden">
                            <div className="relative z-10 flex items-center gap-5">
                                <div className="h-16 w-16 xl:h-20 xl:w-20 rounded-full bg-white border-2 border-slate-200 shadow-sm text-slate-700 flex items-center justify-center font-black text-2xl xl:text-3xl">
                                    {getInitials(student.name)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-2xl xl:text-3xl font-black text-slate-900 tracking-tight">{student.name}</h2>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${student.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                            {student.status}
                                        </span>
                                    </div>
                                    <p className="font-mono text-sm font-bold text-slate-500 bg-slate-200/50 inline-block px-2 py-0.5 rounded">
                                        {student.student_id || "PENDING-ID"}
                                    </p>
                                </div>
                            </div>
                            <button onClick={onClose} className="relative z-10 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-full transition-all bg-white border border-slate-200 shadow-sm">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Drawer Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-6 xl:p-8 bg-slate-50 space-y-8">

                            {/* Basic Information */}
                            <div className="bg-white p-6 rounded-[24px] border border-slate-200/60 shadow-sm">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                                    <UserCheck size={14} /> Basic Information
                                </h4>
                                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                    <div>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Mobile</p>
                                        <p className="text-[15px] font-bold text-slate-900">{student.mobile}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Email</p>
                                        <p className="text-[15px] font-bold text-slate-900 truncate pr-2">{student.email || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Class</p>
                                        <p className="text-[15px] font-bold text-slate-900">Class {student.class}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Batch</p>
                                        <p className="text-[15px] font-bold text-slate-900">{student.batch || "Unassigned"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Enrollment Date</p>
                                        <p className="text-[15px] font-bold text-slate-900">{student.joined_at || "—"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Notes Portal</p>
                                        <p className="text-[15px] font-bold text-slate-900 flex items-center gap-2">
                                            {student.notes_access ? (
                                                <span className="text-emerald-600 flex items-center gap-1"><ShieldCheck size={16} /> Enabled</span>
                                            ) : (
                                                <span className="text-red-500 flex items-center gap-1"><ShieldX size={16} /> Disabled</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>


            {/* ERP Modules Grid */}
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2 px-2">
                  <Briefcase size={14} /> ERP Modules
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <DrawerAppCard icon={<CreditCard size={20} className="text-amber-500" />} title="Fees" onClick={() => handleComingSoon("Fees Tracking")} />
                  <DrawerAppCard icon={<Calendar size={20} className="text-blue-500" />} title="Attendance" onClick={() => handleComingSoon("Attendance Logging")} />
                  <DrawerAppCard icon={<Activity size={20} className="text-purple-500" />} title="Performance" onClick={() => handleComingSoon("Performance Analytics")} />
                  <DrawerAppCard icon={<Users size={20} className="text-purple-500" />} title="Assign Batch" onClick={() => handleComingSoon("Student Batch")} />
                 
                </div>
              </div>


                        </div>

                        {/* Drawer Footer */}
                        <div className="p-6 xl:p-8 bg-white border-t border-slate-100 mt-auto">
                            <Button
                                onClick={() =>
                                    student.status === "active"
                                        ? deactivateStudent(student)
                                        : activateStudent(student)
                                }
                                variant={
                                    student.status === "active"
                                        ? "destructive"
                                        : "default"
                                }
                                className="w-full font-bold h-14 rounded-2xl"
                            >
                                {student.status === "active"
                                    ? "Deactivate Student"
                                    : "Activate Student"}
                            </Button>
                        </div>
                    </>
                )}
            </div>


        </>
        
    );
}

// Internal Component for Drawer Cards
const DrawerAppCard = ({ icon, title, onClick }: { icon: React.ReactNode, title: string, onClick: () => void }) => (
  <button
    onClick={onClick}
    className="bg-white border border-slate-200/60 p-4 rounded-2xl flex flex-col items-start gap-3 hover:border-blue-200 hover:shadow-md transition-all group text-left relative overflow-hidden"
  >
    <div className="p-2.5 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <span className="font-bold text-slate-700 group-hover:text-slate-900">{title}</span>
    <span className="absolute top-3 right-3 text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Soon</span>
  </button>
);