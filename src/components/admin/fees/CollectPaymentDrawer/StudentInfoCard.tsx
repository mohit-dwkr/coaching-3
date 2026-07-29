import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudentFeeData } from "../types";

interface StudentInfoCardProps {
  studentFee: StudentFeeData | null;
}

export default function StudentInfoCard({
  studentFee,
}: StudentInfoCardProps) {
  if (!studentFee) return null;

  return (
    <Card className="border-slate-200 shadow-none">
      <CardContent className="p-5 space-y-4">

        <h3 className="text-base font-semibold text-slate-900">
          Student Information
        </h3>

        <div className="grid grid-cols-2 gap-4">

          <div className="space-y-2">
            <Label>Student Name</Label>
            <Input
              value={studentFee.student?.name ?? ""}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label>Course</Label>
            <Input
              value={studentFee.course?.course_name ?? ""}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label>Batch</Label>
            <Input
              value={studentFee.student?.batch?.batch_name ?? ""}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label>Mobile</Label>
            <Input
              value={studentFee.student?.mobile ?? ""}
              disabled
            />
          </div>

        </div>

      </CardContent>
    </Card>
  );
}