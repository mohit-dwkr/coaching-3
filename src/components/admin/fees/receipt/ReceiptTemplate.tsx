import { ReceiptData } from "/web development/coaching-3/src/components/admin/fees/types";

interface ReceiptTemplateProps {
  receipt: ReceiptData;
}

export default function ReceiptTemplate({
  receipt,
}: ReceiptTemplateProps) {

  return (
    <div  id="receipt-print" className="bg-white w-[210mm] min-h-[297mm] mx-auto p-10 text-black">


<div className="text-center border-b pb-6">
  <h1 className="text-3xl font-bold">
    {receipt.coachingName}
  </h1>
  <p className="text-lg text-slate-600 mt-2">
    PAYMENT RECEIPT
  </p>
</div>


<div className="flex justify-between mt-8">
  <div>
    <p className="text-sm text-slate-500">
      Receipt No
    </p>

    <p className="font-semibold">
      {receipt.receiptNo}
    </p>

  </div>

  <div className="text-right">

    <p className="text-sm text-slate-500">
      Payment Date
    </p>

    <p className="font-semibold">
      {receipt.paymentDate}
    </p>
  </div>
</div>


<div className="mt-10">
  <h2 className="font-bold text-lg border-b pb-2">
    Student Information
  </h2>
  <div className="grid grid-cols-2 gap-6 mt-5">

    <div>

      <p className="text-sm text-slate-500">
        Student Name
      </p>

      <p>{receipt.studentName}</p>

    </div>

    <div>

      <p className="text-sm text-slate-500">
        Student ID
      </p>

      <p>{receipt.studentId}</p>

    </div>

    <div>

      <p className="text-sm text-slate-500">
        Course
      </p>

      <p>{receipt.course}</p>

    </div>

    <div>

      <p className="text-sm text-slate-500">
        Batch
      </p>

      <p>{receipt.batch}</p>

    </div>
  </div>
</div>


<div className="mt-10">
  <h2 className="font-bold text-lg border-b pb-2">
    Payment Information
  </h2>
  <div className="grid grid-cols-2 gap-6 mt-5">

    <div>
      <p className="text-sm text-slate-500">
        Amount Paid
      </p>

      <p className="text-xl font-bold text-green-600">
        ₹{receipt.amount.toLocaleString("en-IN")}
      </p>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Payment Mode
      </p>

      <p>{receipt.paymentMode}</p>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Received By
      </p>

      <p>{receipt.receivedBy}</p>
    </div>

    <div>
      <p className="text-sm text-slate-500">
        Reference No
      </p>

      <p>{receipt.referenceNo || "-"}</p>
    </div>
  </div>
</div>


<div className="mt-10">
  <h2 className="font-bold text-lg border-b pb-2">
    Validity
  </h2>
  <div className="mt-5">

    <p className="text-sm text-slate-500">
      Access Valid
    </p>

    <p>

      {receipt.validFrom || "-"}

      {"  →  "}

      {receipt.validUntil || "-"}
    </p>
  </div>
</div>


<div className="mt-10">
  <h2 className="font-bold text-lg border-b pb-2">
    Remarks
  </h2>
  <p className="mt-4">

    {receipt.remarks || "No Remarks"}
  </p>
</div>


<div className="mt-20 border-t pt-8 text-center">
  <p className="font-semibold">
    Thank You
  </p>

  <p className="text-sm text-slate-500 mt-2">

    This is a computer generated receipt.
  </p>
</div>


    </div>
  );

}