import { supabase } from "@/supabaseClient";

export const updateBatchStudentCount = async (
  batchId: string | null
) => {
  if (!batchId) return;

  // Count students in this batch
  const { count, error: countError } = await supabase
    .from("Coaching-3_Students")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("batch_id", batchId)
    .eq("status", "active");

  if (countError) throw countError;

  // Update batch table
  const { error: updateError } = await supabase
    .from("Coaching-3_StudentBatches")
    .update({
      student_count: count || 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", batchId);

  if (updateError) throw updateError;
};