import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AssignFeeDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
    onAssigned: () => void;
}

export default function AssignFeeDrawer({
    isOpen,
    onClose,
    student,
    onAssigned,
}: AssignFeeDrawerProps) {
    const [loading, setLoading] = useState(false);
    const [feeStructures, setFeeStructures] = useState<any[]>([]);
    const [selectedStructure, setSelectedStructure] = useState("");
    const [discount, setDiscount] = useState(0);

    const [assignedFee, setAssignedFee] = useState<any | null>(null);

    useEffect(() => {

        if (!isOpen) return;

        loadAssignedFee();
        fetchFeeStructures();

    }, [isOpen, student]);

    const fetchFeeStructures = async () => {

        console.log("========== ASSIGN FEE ==========");
        console.log(student);
        console.log("Student Course ID :", student?.course_id);
        if (!student?.course_id) return;

        setLoading(true);

        const { data, error } = await supabase
            .from("Coaching-3_FeeStructures")
            .select("*")
            .eq("course_id", student.course_id)
            .eq("status", "active");

        setLoading(false);

        if (error) {
            toast.error(error.message);
            return;
        }

        setFeeStructures(data || []);
        console.log("Fee Structures :", data);
        console.log("Error :", error);
    };

    const selectedFee = useMemo(() => {
        return feeStructures.find(
            (item) => item.id === selectedStructure

        );
    }, [feeStructures, selectedStructure]);


    const grandTotal = selectedFee
        ? Number(selectedFee.total_fee) +
        Number(selectedFee.admission_fee) +
        Number(selectedFee.registration_fee)
        : 0;

    const finalFee = Math.max(grandTotal - discount, 0);


    const loadAssignedFee = async () => {
        if (!student?.id) {
            setAssignedFee(null);
            return;
        }
        const { data, error } = await supabase
            .from("Coaching-3_StudentFees")
            .select(`
    *,
    fee_structure:fee_structure_id(
        id,
        total_fee,
        admission_fee,
        registration_fee,
        duration_months
    ),
    course:course_id(
        course_name
    )
`)
            .eq("student_id", student.id)
            .maybeSingle();
        if (error) {
            toast.error(error.message);
            return;
        }
        setAssignedFee(data);
    };


    const handleAssignFee = async () => {

        if (!selectedFee) {
            toast.error("Invalid fee structure.");
            return;
        }

        if (!selectedStructure) {
            toast.error("Please select a fee structure.");
            return;
        }

        try {

            // Check if fee already assigned

            const { data: existingFee } = await supabase
                .from("Coaching-3_StudentFees")
                .select("id")
                .eq("student_id", student.id)
                .maybeSingle();

            if (existingFee) {
                toast.error("Fee is already assigned to this student.");
                return;
            }

            const { error } = await supabase
                .from("Coaching-3_StudentFees")
                .insert({
                    student_id: student.id,
                    course_id: student.course_id,
                    fee_structure_id: selectedStructure,

                    // Snapshot
                    course_fee: Number(selectedFee.total_fee),
                    admission_fee: Number(selectedFee.admission_fee),
                    registration_fee: Number(selectedFee.registration_fee),
                    duration_months: Number(selectedFee.duration_months),

                    // Totals
                    total_fee: grandTotal,
                    discount: discount,
                    final_fee: finalFee,
                    paid_amount: 0,
                    remaining_amount: finalFee,
                    status: "Pending"
                });

            if (error) throw error;

            toast.success("Fee assigned successfully.");

            await loadAssignedFee();

            onAssigned();

        } catch (err: any) {

            toast.error(err.message);

        }

    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[80] bg-black/50 flex justify-end">

            <div className="w-full max-w-md bg-white h-screen overflow-y-auto p-6">

                <h2 className="text-2xl font-bold mb-6">
                    {assignedFee ? "✅ Fee Assigned" : "Assign Fee"}
                </h2>

                {!assignedFee ? (
                    <div className="space-y-4">
                        <div>
                            <Label>Student</Label>
                            <Input
                                value={student?.name || ""}
                                disabled
                            />
                        </div>
                        <div>
                            <Label>Course</Label>
                            <Input
                                value={student?.course?.course_name || ""}
                                disabled
                            />
                        </div>
                        <div>
                            <Label>Batch</Label>
                            <Input
                                value={
                                    student?.batch_relation?.batch_name ||
                                    "Not Assigned"
                                }
                                disabled
                            />
                        </div>
                        <div>
                            <Label>Fee Structure</Label>
                            <select
                                className="w-full border rounded-lg p-2"
                                value={selectedStructure}
                                onChange={(e) => setSelectedStructure(e.target.value)}
                            >
                                <option value="">
                                    Select Fee Structure
                                </option>
                                {feeStructures.map((fee) => (
                                    <option
                                        key={fee.id}
                                        value={fee.id}
                                    >
                                        ₹ {fee.total_fee} • {fee.duration_months} Months
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>Discount</Label>
                            <Input
                                type="number"
                                value={discount}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value > grandTotal) {
                                        toast.error(
                                            "Discount cannot be greater than Grand Total."
                                        );

                                        return;
                                    }
                                    setDiscount(value);
                                }}
                            />
                        </div>
                        <div className="rounded-xl border border-slate-200 p-5 space-y-3">
                            <h3 className="font-semibold text-slate-800">
                                Fee Details
                            </h3>
                            <div className="flex justify-between">
                                <span>Course Fee</span>
                                <span>
                                    ₹ {Number(selectedFee?.total_fee || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Admission Fee</span>
                                <span>
                                    ₹ {Number(selectedFee?.admission_fee || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Registration Fee</span>
                                <span>
                                    ₹ {Number(selectedFee?.registration_fee || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Duration</span>
                                <span>
                                    {selectedFee?.duration_months || 0} Months
                                </span>
                            </div>
                            <hr />
                            <div className="flex justify-between font-semibold">
                                <span>Total Course Fee</span>
                                <span>
                                    ₹ {grandTotal.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span>
                                    ₹ {discount.toLocaleString()}
                                </span>
                            </div>

                            <hr />

                            <div className="flex justify-between text-lg font-bold text-green-700">
                                <span>Final Payable Fee</span>
                                <span>
                                    ₹ {finalFee.toLocaleString()}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="w-full"
                                onClick={handleAssignFee}
                            >
                                Assign Fee
                            </Button>
                        </div>
                    </div>
                ) : (


                    <div className="space-y-5">
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                            <h3 className="text-lg font-bold text-emerald-700">
                                ✅ Fee Already Assigned
                            </h3>
                            <p className="text-sm text-slate-600 mt-2">
                                This student's fee has already been assigned.
                                You can view the assigned fee details below.
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-200 p-5 space-y-3">
                            <div className="flex justify-between">
                                <span>Status</span>
                                <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                                    {assignedFee.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Course Fee</span>
                                <span>
                                    ₹ {Number(assignedFee.course_fee).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Admission Fee</span>
                                <span>
                                    ₹ {Number(assignedFee.admission_fee).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Registration Fee</span>
                                <span>
                                    ₹ {Number(assignedFee.registration_fee).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span>
                                    ₹ {Number(assignedFee.discount).toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Duration</span>
                                <span>
                                    {assignedFee.duration_months} Months
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Remaining</span>
                                <span className="font-semibold text-red-600">
                                    ₹ {Number(assignedFee.remaining_amount).toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Paid</span>
                                <span className="font-semibold text-green-600">
                                    ₹ {Number(assignedFee.paid_amount).toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Assigned On</span>
                                <span>
                                    {new Date(assignedFee.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <hr />

                            <div className="flex justify-between font-bold text-lg">
                                <span>Final Fee</span>
                                <span>
                                    ₹ {Number(assignedFee.final_fee).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                            <p className="text-sm text-blue-700">
                                Fee has already been assigned.
                                Future payments and fee updates can be managed from the Fees Manager.
                            </p>
                        </div>

                    </div>
                )}


            </div>
        </div>
    );
}