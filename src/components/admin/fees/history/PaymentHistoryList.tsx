import { useEffect, useState } from "react";
import { PaymentHistory } from "../types";
import { getStudentPaymentHistory } from "./paymentHistoryService";
import PaymentHistoryCard from "./PaymentHistoryCard";

interface PaymentHistoryListProps {
  studentFeeId: string;

  onPrintReceipt?: (
    payment: PaymentHistory
  ) => void;
}

export default function PaymentHistoryList({
  studentFeeId,
  onPrintReceipt,
}: PaymentHistoryListProps) {
  const [payments, setPayments] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [studentFeeId]);

  async function loadHistory() {
    try {
      setLoading(true);

      const data = await getStudentPaymentHistory(studentFeeId);

      setPayments(data);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        Loading payment history...
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        No payments recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <PaymentHistoryCard
          key={payment.id}
          payment={payment}
         onPrint={onPrintReceipt}
        />
      ))}
    </div>
  );
}