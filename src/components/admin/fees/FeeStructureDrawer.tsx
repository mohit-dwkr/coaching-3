import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeeStructure, CourseData } from "./types";
import { CreditCard } from "lucide-react";
import { toast } from "sonner";

interface FeeStructureDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    formData: Omit<FeeStructure, "id" | "course"> & { id?: string }
  ) => Promise<void>;
  structure: FeeStructure | null;
  courses: CourseData[];
}

export default function FeeStructureDrawer({
  isOpen,
  onClose,
  onSave,
  structure,
  courses,
}: FeeStructureDrawerProps) {
  const [courseId, setCourseId] = useState<string>("");
  const [totalFee, setTotalFee] = useState<string>("");
  const [admissionFee, setAdmissionFee] = useState<string>("");
  const [registrationFee, setRegistrationFee] = useState<string>("");
  const [durationMonths, setDurationMonths] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (structure) {
      setCourseId(structure.course_id || "");
      setTotalFee(structure.total_fee?.toString() || "");
      setAdmissionFee(structure.admission_fee?.toString() || "");
      setRegistrationFee(structure.registration_fee?.toString() || "");
      setDurationMonths(structure.duration_months?.toString() || "");
      setIsActive(structure.status === "active");
    } else {
      setCourseId("");
      setTotalFee("");
      setAdmissionFee("");
      setRegistrationFee("");
      setDurationMonths("");
      setIsActive(true);
    }
  }, [structure, isOpen]);


  const grandTotal =
    Number(totalFee || 0) +
    Number(admissionFee || 0) +
    Number(registrationFee || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!courseId) {
      toast.error("Please select a course.");
      return;
    }

    if (!totalFee) {
      toast.error("Please enter the total fee.");
      return;
    }

    if (!durationMonths) {
      toast.error("Please enter the course duration.");
      return;
    }

    try {
      setSaving(true);

      await onSave({
        id: structure?.id,
        course_id: courseId,
        total_fee: Number(totalFee),
        admission_fee: Number(admissionFee || 0),
        registration_fee: Number(registrationFee || 0),
        duration_months: Number(durationMonths),
        status: isActive ? "active" : "inactive",
      });
    } finally {
      setSaving(false);
    };
  }


  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-[480px] p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-6">
          <SheetHeader className="space-y-1 text-left">
            <SheetTitle className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-slate-700" />
              {structure
                ? "Edit Fee Structure"
                : "Create Fee Structure"}
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-500">
              Create or update the fee structure for the selected course.
            </SheetDescription>
          </SheetHeader>

          <form id="fee-structure-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Course Association Selector */}
            <div className="space-y-2">
              <Label htmlFor="course_select" className="text-xs font-semibold text-slate-700 tracking-wide">
                Course *
              </Label>
              <Select value={courseId} onValueChange={setCourseId} required>
                <SelectTrigger id="course_select" className="w-full h-10 border-slate-200 focus:ring-1 bg-white">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent className="max-h-60 rounded-lg">
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id} className="text-sm py-2">
                      {course.course_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Total Fee Ledger Parameters */}
            <div className="space-y-2">
              <Label htmlFor="total_fee" className="text-xs font-semibold text-slate-700 tracking-wide">
                Course Fee (₹)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">₹</span>
                <Input
                  id="total_fee"
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={totalFee}
                  onChange={(e) => setTotalFee(e.target.value)}
                  className="pl-7 h-10 border-slate-200 focus-visible:ring-1 bg-white"
                  required
                />
              </div>
            </div>

            {/* // Fee Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admission_fee" className="text-xs font-semibold text-slate-700 tracking-wide">
                  Admission Fee
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">₹</span>
                  <Input
                    id="admission_fee"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={admissionFee}
                    onChange={(e) => setAdmissionFee(e.target.value)}
                    className="pl-7 h-10 border-slate-200 focus-visible:ring-1 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_fee" className="text-xs font-semibold text-slate-700 tracking-wide">
                  Registration Fee
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">₹</span>
                  <Input
                    id="registration_fee"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={registrationFee}
                    onChange={(e) => setRegistrationFee(e.target.value)}
                    className="pl-7 h-10 border-slate-200 focus-visible:ring-1 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* // Course Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration_months" className="text-xs font-semibold text-slate-700 tracking-wide">
                Course Duration (Months) *
              </Label>
              <Input
                id="duration_months"
                type="number"
                min="1"
                max="60"
                placeholder="e.g. 12"
                value={durationMonths}
                onChange={(e) => setDurationMonths(e.target.value)}
                className="h-10 border-slate-200 focus-visible:ring-1 bg-white"
                required
              />
            </div>


            <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
              <h3 className="text-sm font-semibold">
                Fee Summary
              </h3>

              <div className="flex justify-between text-sm">
                <span>Course Fee</span>
                <span>₹ {Number(totalFee || 0).toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Admission Fee</span>
                <span>₹ {Number(admissionFee || 0).toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Registration Fee</span>
                <span>₹ {Number(registrationFee || 0).toLocaleString()}</span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold">
                <span>Total Course Fee</span>
                <span>
                  ₹ {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>


            {/* // Status */}
            {/* <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div className="space-y-0.5">
                <Label htmlFor="status_switch" className="text-xs font-semibold text-slate-700 tracking-wide">
                  Status
                </Label>
                <p className="text-[11px] text-slate-400">
                  Enable this fee structure for new student assignments.
                </p>
              </div>
              <Switch
                id="status_switch"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div> */}

          </form>
        </div>

        <SheetFooter className="pt-6 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            form="fee-structure-form"
            className="h-10 px-5 font-medium text-sm rounded-lg shadow-sm"
          >
            {saving
              ? "Saving..."
              : structure
                ? "Update Fee Structure"
                : "Create Fee Structure"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}