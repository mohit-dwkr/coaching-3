import { ReceiptData } from "/web development/coaching-3/src/components/admin/fees/types";

interface ReceiptTemplateProps {
  receipt: ReceiptData;
}

export default function ReceiptTemplate({
  receipt,
}: ReceiptTemplateProps) {

return (
  <div
    id="receipt-print"
    className="bg-white w-[210mm] min-h-[297mm] mx-auto p-12 text-slate-900 font-sans relative flex flex-col justify-between print:p-8 print:w-full print:shadow-none"
  >
    <div>
      {/* Top Header & Branding */}
      <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Official Payment Voucher
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {receipt.coachingName}
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Education Management & Coaching Services
          </p>
        </div>

        <div className="text-right space-y-1">
          <span className="inline-block px-3 py-1 bg-slate-900 text-white text-xs font-extrabold uppercase tracking-widest rounded-md shadow-sm">
            PAYMENT RECEIPT
          </span>
          <div className="pt-2 text-xs text-slate-500">
            <span className="font-medium">Date: </span>
            <span className="font-bold text-slate-900">{receipt.paymentDate}</span>
          </div>
        </div>
      </div>

      {/* Meta Bar: Receipt Number & Date Banner */}
      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Receipt Number
          </p>
          <p className="text-base font-black text-slate-900 tracking-wide font-mono">
            #{receipt.receiptNo}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Status
          </p>

          {/* Stamp Badge */}
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            ✓ PAID & VERIFIED
          </span>
        </div>
      </div>

      {/* Student Information Section */}
      <div className="mt-8 space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1">
          Student Details
        </h2>
        
        <div className="grid grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Student Name
            </p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {receipt.studentName}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Student ID / Roll No.
            </p>
            <p className="text-sm font-bold text-slate-900 mt-0.5 font-mono">
              {receipt.studentId}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Enrolled Course
            </p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {receipt.course}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Assigned Batch
            </p>
            <p className="text-sm font-bold text-slate-900 mt-0.5">
              {receipt.batch}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Details Section */}
      <div className="mt-8 space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1">
          Payment Breakdown
        </h2>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                <th className="p-3">Payment Mode</th>
                <th className="p-3">Reference / Txn No</th>
                <th className="p-3">Received By</th>
                <th className="p-3 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold">
              <tr className="bg-white">
                <td className="p-3.5 text-slate-900 font-bold">
                  {receipt.paymentMode}
                </td>
                <td className="p-3.5 text-slate-600 font-mono">
                  {receipt.referenceNo || "-"}
                </td>
                <td className="p-3.5 text-slate-600">
                  {receipt.receivedBy}
                </td>
                <td className="p-3.5 text-right font-black text-slate-900 text-base">
                  ₹{receipt.amount.toLocaleString("en-IN")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Highlight Total Box */}
        <div className="flex justify-end pt-2">
          <div className="w-1/2 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex justify-between items-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
              Total Amount Received
            </span>
            <span className="text-2xl font-black text-emerald-700">
              ₹{receipt.amount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Validity & Access Rights */}
      <div className="mt-8 space-y-3">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1">
          Access & Validity Period
        </h2>
        
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Validity Coverage
          </span>
          <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900 font-mono">
            <span>{receipt.validFrom || "-"}</span>
            <span className="text-slate-400 font-sans">→</span>
            <span>{receipt.validUntil || "-"}</span>
          </div>
        </div>
      </div>

      {/* Remarks Section */}
      <div className="mt-8 space-y-2">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-1">
          Remarks / Special Notes
        </h2>
        <div className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-200/80 text-xs font-medium text-slate-700 italic">
          {receipt.remarks || "No additional remarks added for this transaction."}
        </div>
      </div>
    </div>

    {/* Footer & Signature Section */}
    <div className="mt-16 pt-8 border-t-2 border-slate-200 space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1 max-w-[280px]">
          <p className="text-[11px] font-bold text-slate-900">
            Terms & Conditions
          </p>
          <p className="text-[10px] text-slate-400 leading-tight">
            Fees once paid are non-refundable and non-transferable under any circumstances.
          </p>
        </div>

        {/* Signature Box */}
        <div className="text-center space-y-1">
          <div className="w-44 border-b-2 border-slate-900 pb-1"></div>
          <p className="text-xs font-extrabold text-slate-900 uppercase tracking-wider pt-1">
            Authorized Signature
          </p>
          <p className="text-[10px] text-slate-400">
            {receipt.coachingName}
          </p>
        </div>
      </div>

      {/* Footer Branding Note */}
      <div className="text-center space-y-0.5 border-t border-slate-100 pt-4">
        <p className="text-xs font-bold text-slate-700">
          Thank you for your payment!
        </p>
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          This is a computer-generated official receipt. No physical signature required.
        </p>
      </div>
    </div>
  </div>
);
}