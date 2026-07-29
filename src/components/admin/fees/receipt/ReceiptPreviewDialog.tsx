import ReceiptTemplate from "./ReceiptTemplate";
import { ReceiptData } from "../types";
import { useRef } from "react";

interface ReceiptPreviewDialogProps {
    open: boolean;
    receipt: ReceiptData | null;

    onClose: () => void;
    onPrint: () => void;
}

export default function ReceiptPreviewDialog({
    open,
    receipt,
    onClose,
    onPrint,
}: ReceiptPreviewDialogProps) {

    const receiptRef = useRef<HTMLDivElement>(null);

    if (!open || !receipt) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

            <div className="bg-white rounded-2xl shadow-2xl w-[95vw] h-[95vh] flex flex-col overflow-hidden">

                {/* Header */}

                <div className="flex items-center justify-between border-b px-6 py-4">

                    <div>

                        <h2 className="text-xl font-bold">
                            Receipt Preview
                        </h2>

                        <p className="text-sm text-slate-500">
                            Preview before printing.
                        </p>

                    </div>

                </div>

                {/* Receipt */}

                <div className="flex-1 overflow-auto bg-slate-100 p-8">

                    <div className="mx-auto w-fit shadow-xl">

                        <div ref={receiptRef}>
                            <ReceiptTemplate
                                receipt={receipt}
                            />
                        </div>


                    </div>

                </div>

                {/* Footer */}

                <div className="flex justify-end gap-3 border-t px-6 py-4">

                    <button
                        onClick={onClose}
                        className="rounded-lg border px-5 py-2 hover:bg-slate-100"
                    >
                        Close
                    </button>

                    <button
                        onClick={onPrint}
                        className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                    >
                        Print Receipt
                    </button>

                </div>

            </div>

        </div>

    );
}