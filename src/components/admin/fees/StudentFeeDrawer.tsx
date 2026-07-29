import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CollectPaymentDrawer from "./CollectPaymentDrawer/CollectPaymentDrawer";
import PaymentHistoryList from "./history/PaymentHistoryList";

import {
  StudentFeeData,
  FeeStructure,
  FeeTransaction,
  PaymentHistory,
} from "./types";
import ReceiptPreviewDialog from "./receipt/ReceiptPreviewDialog";
import { generateReceiptData } from "./receipt/generateReceiptData";


interface StudentFeeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentFee: StudentFeeData | null;
  feeStructures: FeeStructure[];
  onSave: (data: StudentFeeData) => Promise<void>;

  onDataChanged: () => Promise<void>;
}

export default function StudentFeeDrawer({
  isOpen,
  onClose,
  studentFee,
  feeStructures,
  onSave,
  onDataChanged,
}: StudentFeeDrawerProps) {



  const [selectedReceipt, setSelectedReceipt] =
    useState<PaymentHistory | null>(null);

const [receiptPreviewOpen, setReceiptPreviewOpen] =
    useState(false);;

  const receiptData =
    selectedReceipt && studentFee
      ? generateReceiptData(
        selectedReceipt,
        studentFee
      )
      : null;

  const [saving, setSaving] = useState(false);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);

  const [formData, setFormData] = useState({
    fee_structure_id: "",
    total_fee: 0,
    discount: 0,
    final_fee: 0,
    paid_amount: 0,
    remaining_amount: 0,
    next_due_date: "",
    status: "Pending" as StudentFeeData["status"],
  });


  useEffect(() => {
    if (!studentFee) return;
    setFormData({
      fee_structure_id: studentFee.fee_structure_id ?? "",
      total_fee: studentFee.total_fee,
      discount: studentFee.discount,
      paid_amount: studentFee.paid_amount,
      next_due_date: studentFee.next_due_date ?? "",
      final_fee: 0,
      remaining_amount: 0,
      status: "Pending",
    });
  }, [studentFee]);


  const finalFee = Math.max(
    formData.total_fee - formData.discount,
    0
  );

  const remainingAmount = Math.max(
    finalFee - formData.paid_amount,
    0
  );

  const status: StudentFeeData["status"] =
    remainingAmount === 0
      ? "Paid"
      : formData.paid_amount > 0
        ? "Partial"
        : "Pending";


  const validateForm = () => {
    if (!formData.fee_structure_id) {
      toast.error("Please select a fee structure.");
      return false;
    }

    if (formData.discount < 0) {
      toast.error("Discount cannot be negative.");
      return false;
    }

    if (formData.discount > formData.total_fee) {
      toast.error("Discount cannot exceed total fee.");
      return false;
    }

    if (formData.paid_amount < 0) {
      toast.error("Paid amount cannot be negative.");
      return false;
    }

    if (formData.paid_amount > finalFee) {
      toast.error("Paid amount cannot exceed final fee.");
      return false;
    }

    return true;
  };


  const handleSave = async () => {
    if (!studentFee) return;

    if (!validateForm()) return;

    try {
      setSaving(true);

      await onSave({
        ...studentFee,

        fee_structure_id: formData.fee_structure_id,

        total_fee: formData.total_fee,

        discount: formData.discount,

        final_fee: finalFee,

        paid_amount: formData.paid_amount,

        remaining_amount: remainingAmount,

        next_due_date: formData.next_due_date || null,

        status,
      });

      toast.success("Student fee updated successfully.");

      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to update student fee.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-[480px] p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <SheetHeader className="space-y-1 text-left">
            <SheetTitle className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-slate-700" />
              Student Fee Ledger
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              View and update the student's fee details.
            </SheetDescription>
          </SheetHeader>

          {studentFee && (
            <div className="space-y-6">

              {/* Student Information */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Student Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Student</Label>
                    <Input
                      value={studentFee.student?.name ?? ""}
                      disabled
                    />
                  </div>
                  <div>
                    <Label>Course</Label>
                    <Input
                      value={studentFee.course?.course_name ?? ""}
                      disabled
                    />
                  </div>
                  <div>
                    <Label>Batch</Label>
                    <Input
                      value={studentFee.student?.batch?.batch_name ?? ""}
                      disabled
                    />
                  </div>
                  <div>
                    <Label>Mobile</Label>
                    <Input
                      value={studentFee.student?.mobile ?? ""}
                      disabled
                    />
                  </div>
                </div>
              </div>


              {/* Fee Details */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Fee Details
                </h3>


                <div className="space-y-2">
                  <Label>Course Fee</Label>
                  <Input
                    value={`₹${studentFee.course_fee.toLocaleString("en-IN")}`}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label>Admission Fee</Label>
                  <Input
                    value={`₹${studentFee.admission_fee.toLocaleString("en-IN")}`}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label>Registration Fee</Label>
                  <Input
                    value={`₹${studentFee.registration_fee.toLocaleString("en-IN")}`}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label>Duration</Label>
                  <Input
                    value={`${studentFee.duration_months} Months`}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label>Grand Total</Label>
                  <Input
                    value={`₹${studentFee.total_fee.toLocaleString("en-IN")}`}
                    disabled
                  />
                </div>

                {/* Discount */}
                <div className="space-y-2">
                  <Label>Discount</Label>
                  <Input
                    value={formData.discount}
                    disabled
                  />
                </div>

                {/* Total Fee
                <div className="space-y-2">
                  <Label>Total Fee</Label>
                  <Input
                    value={formData.total_fee}
                    disabled
                  />
                </div> */}

                {/* Final Fee */}
                <div className="space-y-2">
                  <Label>Final Fee</Label>
                  <Input
                    value={finalFee}
                    disabled
                  />
                </div>
              </div>


              {/* Payment Summary */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">

                <h3 className="text-sm font-semibold text-slate-900">
                  Payment Summary
                </h3>

                <div className="space-y-2">
                  <Label>Paid Amount</Label>

                  <Input
                    value={`₹${studentFee.paid_amount.toLocaleString("en-IN")}`}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label>Remaining Amount</Label>

                  <Input
                    value={remainingAmount}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label>Next Due Date</Label>

                  <Input
                    value={
                      studentFee.next_due_date
                        ? new Date(studentFee.next_due_date).toLocaleDateString("en-IN")
                        : "-"
                    }
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>

                  <Input
                    value={status}
                    disabled
                  />
                </div>
              </div>



              {/* Payment History */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-4">

                <h3 className="text-sm font-semibold text-slate-900">
                  Payment History
                </h3>

                <PaymentHistoryList
                  studentFeeId={studentFee.id}
                  onPrintReceipt={(payment) => {

                    setSelectedReceipt(payment);

                    setReceiptPreviewOpen(true);

                  }}
                />

              </div>

            </div>
          )}
        </div>

        <CollectPaymentDrawer
          isOpen={paymentDrawerOpen}
          onClose={() => setPaymentDrawerOpen(false)}
          studentFee={studentFee}
          onPaymentSuccess={(receiptNo) => {
            console.log("Receipt:", receiptNo);

            onDataChanged?.();
          }}
        />


        <ReceiptPreviewDialog
          open={receiptPreviewOpen}
          receipt={receiptData}
          onClose={() => {
            setReceiptPreviewOpen(false);
            setSelectedReceipt(null);
          }}
          onPrint={() => {
             window.print();
          }}
        />

        <SheetFooter className="pt-6 border-t flex justify-end gap-2">

          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>

          <Button
            onClick={() => setPaymentDrawerOpen(true)}
          >
            Collect Payment
          </Button>

        </SheetFooter>

      </SheetContent>
    </Sheet>
  );
}