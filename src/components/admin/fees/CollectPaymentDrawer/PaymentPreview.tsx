import { StudentFeeData } from "../types";
import { PaymentFormData } from "../types";

interface PaymentPreviewProps {
  studentFee: StudentFeeData | null;
  formData: PaymentFormData;
}

export default function PaymentPreview({
  studentFee,
  formData,
}: PaymentPreviewProps) {
  if (!studentFee) return null;

  const payment = Number(formData.amount) || 0;

  const newPaid = studentFee.paid_amount + payment;

  const newRemaining = Math.max(
    studentFee.final_fee - newPaid,
    0
  );

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN")}`;

  const formatDate = (date: string | Date | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Temporary
  // Later utils.ts se calculate hoga
  const newValidity = studentFee.next_due_date;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">

      <h3 className="text-base font-semibold">
        Payment Preview
      </h3>

      <div className="space-y-4">

        {/* Paid */}

        <div className="flex justify-between items-center">

          <span className="text-slate-500">
            Current Paid
          </span>

          <span>
            {formatCurrency(studentFee.paid_amount)}
          </span>

        </div>

        <div className="flex justify-between items-center">

          <span className="text-slate-500">
            Payment
          </span>

          <span className="font-medium text-blue-600">
            + {formatCurrency(payment)}
          </span>

        </div>

        <div className="flex justify-between items-center border-t pt-3">

          <span className="font-semibold">
            New Paid
          </span>

          <span className="font-bold text-green-600">
            {formatCurrency(newPaid)}
          </span>

        </div>

        <hr />

        {/* Remaining */}

        <div className="flex justify-between items-center">

          <span className="text-slate-500">
            Current Remaining
          </span>

          <span>
            {formatCurrency(studentFee.remaining_amount)}
          </span>

        </div>

        <div className="flex justify-between items-center">

          <span className="font-semibold">
            New Remaining
          </span>

          <span className="font-bold text-red-600">
            {formatCurrency(newRemaining)}
          </span>

        </div>

        <hr />

        {/* Validity */}

        <div className="flex justify-between items-center">

          <span className="text-slate-500">
            Current Valid Till
          </span>

          <span>
            {formatDate(studentFee.next_due_date)}
          </span>

        </div>

        <div className="flex justify-between items-center">

          <span className="font-semibold">
            New Valid Till
          </span>

          <span className="font-bold">
            {formatDate(newValidity)}
          </span>

        </div>

      </div>

    </div>
  );
}