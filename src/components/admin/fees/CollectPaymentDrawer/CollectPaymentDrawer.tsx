import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { collectPayment } from "../services/paymentService";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import { StudentFeeData } from "../types";
import { PaymentFormData } from "../types";

import StudentInfoCard from "./StudentInfoCard";
import CurrentFeeSummary from "./CurrentFeeSummary";
import PaymentForm from "./PaymentForm";
import PaymentPreview from "./PaymentPreview";
import FooterActions from "./FooterActions";

interface CollectPaymentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentFee: StudentFeeData | null;
  onPaymentSuccess?: (receiptNo: string) => void;
}

export default function CollectPaymentDrawer({
  isOpen,
  onClose,
  studentFee,
  onPaymentSuccess,
}: CollectPaymentDrawerProps) {



  const [formData, setFormData] = useState<PaymentFormData>({
    amount: "",
    paymentDate: new Date(),
    paymentMode: "Cash",
    monthsCovered: 1,
    referenceNo: "",
    remarks: "",
  });


  const handleSubmit = async () => {
    if (!studentFee) return;

    try {
      setLoading(true);

      const paymentAmount = Number(formData.amount);

      if (!paymentAmount || paymentAmount <= 0) {
        toast.error("Please enter a valid payment amount.");
        return;
      }

      if (paymentAmount > studentFee.remaining_amount) {
        toast.error("Payment amount cannot exceed remaining fee.");
        return;
      }

      const response = await collectPayment({
        studentFee,
        formData,
        receivedBy: "Admin",
      });

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(
        `${response.message} Receipt: ${response.receiptNo}`
      );

      onPaymentSuccess?.(response.receiptNo ?? "");

      onClose();

    } catch (error) {
      console.error(error);

      toast.error("Something went wrong while collecting payment.");

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!isOpen || !studentFee) return;

    setFormData({
      amount: "",
      paymentDate: new Date(),
      paymentMode: "Cash",
      monthsCovered: 1,
      referenceNo: "",
      remarks: "",
    });
  }, [isOpen, studentFee]);

  const [loading, setLoading] = useState(false);

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent className="w-full sm:max-w-[650px] p-0 flex flex-col">

        <SheetHeader className="border-b p-6">
          <SheetTitle>Collect Payment</SheetTitle>
          <SheetDescription>
            Record a new payment for this student.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          <StudentInfoCard studentFee={studentFee} />

          <CurrentFeeSummary studentFee={studentFee} />

          <PaymentForm
            formData={formData}
            setFormData={setFormData}
          />

          <PaymentPreview
            studentFee={studentFee}
            formData={formData}
          />

        </div>
        <FooterActions
          loading={loading}
          onClose={onClose}
          onSubmit={handleSubmit}
        />

      </SheetContent>
    </Sheet>
  )
}