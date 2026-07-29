import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { updateBatchStudentCount } from "@/utils/batchUtils";
import { toast } from "sonner";
import { getHighestRollNumber } from "@/utils/rollNumberUtils";

interface BulkAssignBatchDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    students: any[];
    onAssigned: () => void;
}

export default function BulkAssignBatchDrawer({
    isOpen,
    onClose,
    students,
    onAssigned,
}: BulkAssignBatchDrawerProps) {

    if (!isOpen) return null;

    const [batches, setBatches] = useState<any[]>([]);
    const [selectedBatch, setSelectedBatch] = useState("");

    const fetchBatches = async () => {
        if (students.length === 0) {
            setBatches([]);
            return;
        }

        const courseId = students[0].course_id;

        const { data, error } = await supabase
            .from("Coaching-3_StudentBatches")
            .select("*")
            .eq("course_id", courseId)
            .eq("status", "active")
            .order("batch_name");

        if (!error && data) {
            setBatches(data);
        }
    };
    useEffect(() => {
        if (isOpen) {
            fetchBatches();
            setSelectedBatch("");
        }
    }, [isOpen]);


    const assignBulkBatch = async () => {
        if (!selectedBatch) {
            toast.error("Please select a batch.");
            return;
        }
        const oldBatchIds = [
            ...new Set(
                students
                    .map(student => student.batch_id)
                    .filter(Boolean)
            ),
        ];
        try {
            const selected = batches.find(

                (batch) => batch.id === selectedBatch
            );


            if (!selected) {
                toast.error("Batch not found.");
                return;
            }

            let highestRoll = await getHighestRollNumber(selectedBatch);

            for (const student of students) {

                let rollNumber = student.roll_number;

                if (student.batch_id !== selectedBatch) {
                    highestRoll++;
                    rollNumber = highestRoll;
                }

                const { error } = await supabase
                    .from("Coaching-3_Students")
                    .update({
                        batch_id: selectedBatch,
                        batch: selected.batch_name,
                        roll_number: rollNumber,
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", student.id);

                if (error) throw error;
            }

            for (const batchId of oldBatchIds) {

                await updateBatchStudentCount(batchId);

            }

            await updateBatchStudentCount(selectedBatch);

            toast.success("Students assigned successfully.");

            onAssigned();

            onClose();

        } catch (err: any) {
            toast.error(err.message);
        }
    };


    return (
        <>
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black/40 z-40"
            />

            <div className="fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white z-50 shadow-xl flex flex-col">

                <div className="flex items-center justify-between p-6 border-b">

                    <div>

                        <h2 className="text-2xl font-black">
                            Bulk Assign Batch
                        </h2>

                        <p className="text-slate-500 text-sm mt-1">
                            Selected Students : {students.length}
                        </p>

                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                    >
                        <X size={20} />
                    </Button>

                </div>

                <div className="flex-1 p-6">

                    <p className="font-bold mb-4">
                        Available Batches
                    </p>

                    <div className="space-y-4">

                        <div>

                            <label className="text-sm font-bold text-slate-700 block mb-2">
                                Select Batch
                            </label>

                            <select
                                value={selectedBatch}
                                onChange={(e) => setSelectedBatch(e.target.value)}
                                className="w-full border rounded-xl p-3"
                            >

                                <option value="">
                                    Choose Batch
                                </option>

                                {batches.map((batch) => (

                                    <option
                                        key={batch.id}
                                        value={batch.id}
                                    >
                                        {batch.batch_name}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>

                </div>
                <Button
                    onClick={assignBulkBatch}
                    className="w-full"
                >
                    Assign Batch
                </Button>
            </div>
        </>
    );
}