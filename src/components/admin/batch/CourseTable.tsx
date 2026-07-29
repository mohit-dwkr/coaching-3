import { BookOpen, Layers, Users, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseTableProps {
  courses: any[];
  onEdit: (course: any) => void;
  onDelete: (course: any) => void;
}

export default function CourseTable({
  courses, onEdit, onDelete,
}: CourseTableProps) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-300/60 shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full text-left whitespace-nowrap">

          <thead className="bg-slate-50 border-b border-slate-200">

            <tr className="text-xs uppercase tracking-widest text-slate-500">

              <th className="p-5 pl-8">Course</th>

              <th className="p-5">Description</th>

              <th className="p-5 text-center">Batches</th>

              <th className="p-5 text-center">Students</th>

              <th className="p-5 text-center">Status</th>

              <th className="p-5 pr-8 text-right">Actions</th>

            </tr>

          </thead>

          <tbody>

            {courses.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="py-24 text-center"
                >

                  <div className="flex flex-col items-center">

                    <BookOpen
                      size={42}
                      className="text-slate-300 mb-4"
                    />

                    <p className="text-xl font-black text-slate-700">

                      No Courses Found

                    </p>

                    <p className="text-slate-500 mt-2">

                      Click "Add Course" to create your first course.

                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              courses.map((course) => (

                <tr
                  key={course.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >

                  <td className="p-5 pl-8">

                    <div className="flex items-center gap-3">

                      <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">

                        <BookOpen
                          size={20}
                          className="text-blue-600"
                        />

                      </div>

                      <div>

                        <p className="font-black text-slate-900">

                          {course.course_name}

                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="p-5 text-slate-600">

                    {course.description || "No description"}

                  </td>

                  <td className="p-5 text-center">

                    <span className="inline-flex items-center gap-2">

                      <Layers size={16} />

                      {course.batchCount}

                    </span>

                  </td>

                  <td className="p-5 text-center">

                    <span className="inline-flex items-center gap-2">

                      <Users size={16} />

                      {course.studentCount}

                    </span>

                  </td>

                  <td className="p-5 text-center">

                    <span className="px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-black">

                      {course.status}

                    </span>

                  </td>

                  <td className="p-5 pr-8">

                    <div className="flex justify-end gap-2">

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onEdit(course)}
                      >

                        <Pencil size={16} />

                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => onDelete(course)}
                      >

                        <Trash2 size={16} />

                      </Button>

                    </div>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}