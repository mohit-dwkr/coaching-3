import { Layers, Users, Pencil, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BatchTableProps {
  batches: any[];
  onEdit: (batch: any) => void;
  onDelete: (batch: any) => void;
}

export default function BatchTable({
  batches,
  onEdit,
  onDelete,
}: BatchTableProps) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-300/60 shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        <table className="w-full text-left whitespace-nowrap">

          <thead className="bg-slate-50 border-b border-slate-200">

            <tr className="text-xs uppercase tracking-widest text-slate-500">

              <th className="p-5 pl-8">Batch</th>

              <th className="p-5">Course</th>

              <th className="p-5 text-center">Timing</th>

              <th className="p-5 text-center">Students</th>

              <th className="p-5 text-center">Status</th>

              <th className="p-5 pr-8 text-right">Actions</th>

            </tr>

          </thead>

          <tbody>

            {batches.length === 0 ? (

              <tr>

                <td colSpan={6} className="py-24 text-center">

                  <div className="flex flex-col items-center">

                    <Layers
                      size={42}
                      className="text-slate-300 mb-4"
                    />

                    <p className="text-xl font-black text-slate-700">
                      No Batches Found
                    </p>

                    <p className="text-slate-500 mt-2">
                      Click "Create Batch" to create your first batch.
                    </p>

                  </div>

                </td>

              </tr>

            ) : (

              batches.map((batch) => (

                <tr
                  key={batch.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >

                  <td className="p-5 pl-8">

                    <div className="flex items-center gap-3">

                      <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">

                        <Layers
                          size={20}
                          className="text-blue-600"
                        />

                      </div>

                      <div>

                        <p className="font-black text-slate-900">

                          {batch.batch_name}

                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="p-5">

                    {batch.course?.course_name}

                  </td>

                  <td className="p-5 text-center">

                    <span className="inline-flex items-center gap-2">

                      <Clock size={16} />

                      {batch.start_time} - {batch.end_time}

                    </span>

                  </td>

                  <td className="p-5 text-center">

                    <span className="inline-flex items-center gap-2">

                      <Users size={16} />

                      {batch.studentCount}/{batch.max_students}

                    </span>

                  </td>

                  <td className="p-5 text-center">

                    <span className="px-3 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-black">

                      {batch.status}

                    </span>

                  </td>

                  <td className="p-5 pr-8">

                    <div className="flex justify-end gap-2">

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => onEdit(batch)}
                      >
                        <Pencil size={16} />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => onDelete(batch)}
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