import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import BatchTable from "./BatchTable";
import BatchDrawer from "./BatchDrawer";
import { toast } from "sonner";


interface BatchSectionProps {
  onUpdated: () => void;
}

export default function BatchSection({
  onUpdated,
}: BatchSectionProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [batches, setBatches] = useState<any[]>([]);

  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  const fetchBatches = async () => {
   const { data: batches, error } = await supabase
  .from("Coaching-3_StudentBatches")
  .select(`
    *,
    course:course_id (
      id,
      course_name
    )
  `)
  .order("batch_name");

if (error) return;

// Students fetch
const { data: students } = await supabase
  .from("Coaching-3_Students")
  .select("batch_id");

const finalBatches = batches.map((batch) => {

  const studentCount =
    students?.filter(
      s => s.batch_id === batch.id
    ).length || 0;

  return {
    ...batch,
    studentCount,
  };

});

setBatches(finalBatches);
onUpdated();
  };
  useEffect(() => {
    fetchBatches();
  }, []);


const deleteBatch = async (batch: any) => {

  if (batch.studentCount > 0) {

    toast.error(
      "Cannot delete batch. Move students first."
    );

    return;

  }

  if (
    !window.confirm(
      `Delete "${batch.batch_name}" ?`
    )
  ) {
    return;
  }

  const { error } = await supabase
    .from("Coaching-3_StudentBatches")
    .delete()
    .eq("id", batch.id);

  if (error) {

    toast.error(error.message);

    return;

  }

  toast.success("Batch deleted.");

 await fetchBatches();

};


  return (
    <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden mt-8">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-8 border-b border-slate-100">

        <div>

          <h2 className="text-2xl font-black text-slate-900">
            Batches
          </h2>

          <p className="text-slate-500 mt-1">
            Create and manage coaching batches.
          </p>

        </div>

        <Button
          onClick={() => setIsDrawerOpen(true)}
          className="h-12 px-6 rounded-xl font-bold"
        >
          <Plus size={18} className="mr-2" />
          Create Batch
        </Button>

      </div>

      <BatchTable
        batches={batches}
        onEdit={(batch) => {
          setSelectedBatch(batch);
          setIsDrawerOpen(true);
        }}
         onDelete={deleteBatch}
      />

      <BatchDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setSelectedBatch(null);
          setIsDrawerOpen(false);
        }}
        selectedBatch={selectedBatch}
        onBatchCreated={fetchBatches}
      />

    </div>
  );
}