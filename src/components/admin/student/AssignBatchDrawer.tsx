import { useEffect, useState } from "react";
import { X, Users, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import { updateBatchStudentCount } from "@/utils/batchUtils";
import { getNextRollNumber } from "@/utils/rollNumberUtils";

interface AssignBatchDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
    onAssigned: () => void;
}

export default function AssignBatchDrawer({
    isOpen,
    onClose,
    student,
    onAssigned,
}: AssignBatchDrawerProps) {
    const [batches, setBatches] = useState<any[]>([]);
    const [selectedBatch, setSelectedBatch] = useState("");

    const fetchBatches = async () => {
        if (!student?.course_id) {
            setBatches([]);
            return;
        }

        const { data, error } = await supabase
            .from("Coaching-3_StudentBatches")
            .select("*")
            .eq("course_id", student.course_id)
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
    }, [isOpen, student]);

    if (!isOpen) return null;


    const assignBatch = async () => {
        if (!selectedBatch) {
            toast.error("Please select a batch.");
            return;
        }
        const oldBatchId = student.batch_id;
        try {
            const selected = batches.find(
                (b) => b.id === selectedBatch
            );


            let rollNumber = student.roll_number;
            if (oldBatchId !== selectedBatch) {
                rollNumber = await getNextRollNumber(selectedBatch);
            }
            const { error } = await supabase
                .from("Coaching-3_Students")
                .update({
                    batch_id: selectedBatch,
                    batch: selected?.batch_name || "",
                    roll_number: rollNumber,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", student.id);


            // Update old batch count
            if (oldBatchId && oldBatchId !== selectedBatch) {
                await updateBatchStudentCount(oldBatchId);
            }

            // Update new batch count
            if (oldBatchId !== selectedBatch) {
                await updateBatchStudentCount(selectedBatch);
            }

            if (error) throw error;

            toast.success("Batch assigned successfully.");

            onAssigned();

            onClose();
        } catch (err: any) {
            toast.error(err.message);
        }
    };



    return (
        <>
            {/* Overlay */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
            />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-[70] shadow-2xl flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">

                    <div>
                        <h2 className="text-2xl font-black text-slate-900">
                            Assign Batch
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Assign this student to a coaching batch.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* Body */}

                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Student */}

                    <div className="border rounded-2xl p-5">

                        <p className="text-xs uppercase tracking-widest font-black text-slate-400 mb-3">
                            Student
                        </p>

                        <div className="flex items-center gap-4">

                            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center font-black text-blue-600">
                                {student?.name?.charAt(0)?.toUpperCase()}
                            </div>

                            <div>

                                <p className="font-black text-slate-900">
                                    {student?.name}
                                </p>

                                <p className="text-sm text-slate-500">
                                    {student?.student_id}
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* Course */}

                    <div className="border rounded-2xl p-5">

                        <p className="text-xs uppercase tracking-widest font-black text-slate-400 mb-3">
                            Course
                        </p>

                        <div className="flex items-center gap-3">

                            <Layers
                                size={18}
                                className="text-blue-600"
                            />

                            <span className="font-bold text-slate-800">
                                {student?.course?.course_name || "No Course"}
                            </span>

                        </div>

                    </div>

                    {/* Batch */}

                    <div>

                        <label className="text-sm font-bold text-slate-700">
                            Select Batch
                        </label>

                        <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="mt-2 w-full h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-blue-500"
                        >
                            <option value="">
                                Select Batch
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

                    {/* Empty */}

                    {batches.length === 0 && (

                        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">

                            <Users
                                size={40}
                                className="mx-auto text-slate-300"
                            />

                            <p className="font-black text-slate-700 mt-4">
                                No Active Batches
                            </p>

                            <p className="text-sm text-slate-500 mt-2">
                                Create a batch for this course first.
                            </p>

                        </div>

                    )}

                </div>

                {/* Footer */}

                <div className="border-t border-slate-200 p-6 flex gap-3">

                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 h-12 rounded-xl font-bold"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={assignBatch}
                        className="flex-1 h-12 rounded-xl font-bold"
                        disabled={!selectedBatch}
                    >
                        Assign Batch
                    </Button>

                </div>

            </div>
        </>
    );
}