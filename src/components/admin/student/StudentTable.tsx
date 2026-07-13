import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import {
  Search,
  Phone,
  Layers,
  ShieldCheck,
  ShieldX,
  Eye,
  GraduationCap,
} from "lucide-react";

interface StudentTableProps {
  students: any[];

  openStudentDrawer: (student: any) => void;

  toggleNotesAccess: (student: any) => void;

  getInitials: (name: string) => string;

  inactive?: boolean;
}

export default function StudentTable({
  students,
  openStudentDrawer,
  toggleNotesAccess,
  getInitials,
  inactive = false,
}: StudentTableProps) {
  return (
    <>
      <div className="bg-white rounded-[24px] border border-slate-300/60 shadow-sm overflow-hidden hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/80 border-b border-slate-400 text-[11px] font-black uppercase text-slate-500 tracking-widest">
              <tr>
                <th className="p-5 pl-8">Student ID</th>
                <th className="p-5">Student Profile</th>
                <th className="p-5">Class & Batch</th>
                <th className="p-5">Status</th>
                <th className="p-5">Notes Access</th>
                <th className="p-5 pr-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="text-slate-300 mb-4" size={40} />
                      <p className="text-slate-500 font-bold text-lg">No students found</p>
                      <p className="text-slate-400 text-sm mt-1">Adjust your search or filters to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5 pl-8 font-mono text-sm font-bold text-slate-600">
                      {s.student_id || "N/A"}
                    </td>

                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm border border-blue-100">
                          {getInitials(s.name)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-[15px] group-hover:text-blue-600 transition-colors">{s.name}</span>
                          <span className="text-sm text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                            <Phone size={12} className="text-slate-400" /> {s.mobile}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-black uppercase tracking-wider">
                          Class {s.class}
                        </span>
                        <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                          <Layers size={12} /> {s.batch || "Unassigned"}
                        </span>
                      </div>
                    </td>

                    <td className="p-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide ${s.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        {s.status}
                      </span>
                    </td>

                    <td className="p-5">
                      {s.notes_access ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wide border border-blue-100">
                          <ShieldCheck size={14} /> Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-black uppercase tracking-wide border border-red-100">
                          <ShieldX size={14} /> Disabled
                        </span>
                      )}
                    </td>

                    <td className="p-5 pr-8 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {/* View Profile Button: Yeh sirf hover par dikhega */}
                        <Button
                          onClick={() => openStudentDrawer(s)}
                          variant="outline"
                          className="h-10 px-4 rounded-xl border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 font-bold opacity-0 group-hover:opacity-100"
                        >
                          <Eye size={16} className="mr-2" /> View Profile
                        </Button>

                        {/* Switch Toggle: Yeh humesha visible rahega */}
                        {inactive ? (
                          <span className="text-xs font-bold text-slate-400">
                          Not Available
                          </span>
                        ) : (
                          <Switch
                            checked={s.notes_access}
                            onCheckedChange={() => toggleNotesAccess(s)}
                          />
                        )}

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards View (Visible only on small screens) */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {students.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl border border-dashed border-slate-300 text-center">
            <p className="text-slate-500 font-bold">No students found</p>
          </div>
        ) : (
          students.map(s => (
            <div key={s.id} className="bg-white p-5 rounded-[20px] border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-black">
                    {getInitials(s.name)}
                  </div>
                  <div>
                    <p className="font-black text-slate-900 text-base">{s.name}</p>
                    <p className="font-mono text-xs text-slate-500 font-bold">{s.student_id || "N/A"}</p>
                  </div>
                </div>
                <span className={`h-2.5 w-2.5 rounded-full ${s.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm font-medium text-slate-600">
                <div className="bg-slate-50 p-2 rounded-lg flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {s.mobile}</div>
                <div className="bg-slate-50 p-2 rounded-lg flex items-center gap-2"><GraduationCap size={14} className="text-slate-400" /> Class {s.class}</div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Notes Access</span>
                {inactive ? (
                  <span className="text-xs font-bold text-slate-400">
                    Inactive
                  </span>
                ) : (
                  <Switch
                    checked={s.notes_access}
                    onCheckedChange={() => toggleNotesAccess(s)}
                  />
                )}
              </div>

              <Button onClick={() => openStudentDrawer(s)} className="w-full bg-slate-900 text-white rounded-xl h-11 font-bold">
                View Full Profile
              </Button>
            </div>
          ))
        )}
      </div>
    </>
  );
}