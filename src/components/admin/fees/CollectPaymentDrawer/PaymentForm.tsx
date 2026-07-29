import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import {
  PaymentFormData,
  PaymentFormProps,
  PaymentMode,
} from "../types";


const paymentModes: PaymentMode[] = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Card",
  "Cheque",
];

const monthOptions = [1, 2, 3, 4, 5, 6, 12];


export default function PaymentForm({
  formData,
  setFormData,
}: PaymentFormProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">

      <h3 className="text-base font-semibold">
        Payment Information
      </h3>

      <div className="grid grid-cols-2 gap-4">

        {/* Amount */}

        <div className="space-y-2">
          <Label>Amount</Label>

          <Input
            type="number"
            placeholder="Enter Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                amount: e.target.value,
              }))
            }
          />
        </div>

        {/* Payment Mode */}

        <div className="space-y-2">
          <Label>Payment Mode</Label>

          <Select
            value={formData.paymentMode}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
             paymentMode: value as PaymentMode,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {paymentModes.map((mode) => (
                <SelectItem key={mode} value={mode}>
                  {mode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Months Covered */}

        <div className="space-y-2">
          <Label>Months Covered</Label>

          <Select
            value={String(formData.monthsCovered)}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                monthsCovered: Number(value),
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {monthOptions.map((month) => (
                <SelectItem
                  key={month}
                  value={String(month)}
                >
                  {month} Month{month > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Date */}

        <div className="space-y-2">
          <Label>Payment Date</Label>

          <Input
            type="date"
            value={formData.paymentDate
              .toISOString()
              .split("T")[0]}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                paymentDate: new Date(e.target.value),
              }))
            }
          />
        </div>

      </div>

      {/* Reference */}

      <div className="space-y-2">
        <Label>Reference Number</Label>

        <Input
          placeholder="Optional"
          value={formData.referenceNo}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              referenceNo: e.target.value,
            }))
          }
        />
      </div>

      {/* Remarks */}

      <div className="space-y-2">
        <Label>Remarks</Label>

        <Textarea
          rows={3}
          placeholder="Optional remarks..."
          value={formData.remarks}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              remarks: e.target.value,
            }))
          }
        />
      </div>

    </div>
  );
}