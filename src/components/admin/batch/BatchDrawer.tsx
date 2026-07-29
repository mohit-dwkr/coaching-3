import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";

interface BatchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchCreated: () => void;
  selectedBatch: any;
}

export default function BatchDrawer({
  isOpen,
  onClose,
  onBatchCreated,
  selectedBatch,
}: BatchDrawerProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [batchName, setBatchName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [days, setDays] = useState("Daily");
  const [maxStudents, setMaxStudents] = useState("");

  const fetchCourses = async () => {
    const { data } = await supabase
      .from("Coaching-3_Courses")
      .select("*")
      .eq("status", "active")
      .order("course_name");

    if (data) {
      setCourses(data);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);


  useEffect(() => {

    if (selectedBatch) {

      setSelectedCourse(selectedBatch.course_id || "");
      setBatchName(selectedBatch.batch_name || "");
      setDescription(selectedBatch.description || "");
      setStartTime(selectedBatch.start_time || "");
      setEndTime(selectedBatch.end_time || "");
      setDays(selectedBatch.days || "Daily");
      setMaxStudents(String(selectedBatch.max_students || ""));

    } else {

      setSelectedCourse("");
      setBatchName("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setDays("Daily");
      setMaxStudents("");

    }

  }, [selectedBatch]);


  const saveBatch = async () => {

    if (!selectedCourse) {
      toast.error("Please select a course.");
      return;
    }

    if (!batchName.trim()) {
      toast.error("Batch name is required.");
      return;
    }

    if (!startTime) {
      toast.error("Please select start time.");
      return;
    }

    if (!endTime) {
      toast.error("Please select end time.");
      return;
    }

    try {

      if (selectedBatch) {

        // UPDATE

        const { error } = await supabase
          .from("Coaching-3_StudentBatches")
          .update({
            course_id: selectedCourse,
            batch_name: batchName.trim(),
            description: description.trim(),
            start_time: startTime,
            end_time: endTime,
            days,
            max_students: Number(maxStudents),
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedBatch.id);

        if (error) throw error;

        toast.success("Batch updated successfully.");

      } else {

        // CREATE

        const { error } = await supabase
          .from("Coaching-3_StudentBatches")
          .insert({
            course_id: selectedCourse,
            batch_name: batchName.trim(),
            description: description.trim(),
            start_time: startTime,
            end_time: endTime,
            days,
            max_students: Number(maxStudents),
            student_count: 0,
            status: "active",
          });

        if (error) throw error;

        toast.success("Batch created successfully.");

      }

      setSelectedCourse("");
      setBatchName("");
      setDescription("");
      setStartTime("");
      setEndTime("");
      setDays("Daily");
      setMaxStudents("");

      onBatchCreated();
      onClose();

    } catch (err: any) {

      toast.error(err.message);

    }

  };


  // Agar drawer open nahi hai to kuch bhi render mat karo
  if (!isOpen) return null;

  // Final Return Statement jo missing tha
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-xl flex flex-col p-6 overflow-y-auto transform transition-transform animate-in slide-in-from-right duration-200">

        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {selectedBatch ? "Edit Batch" : "Create New Batch"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form Fields */}

        <div className="space-y-4 flex-1">

          {/* <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Select Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Choose a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name}
                </option>
              ))}
            </select>
          </div> */}


          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Batch Name</label>
            <Input
              type="text"
              placeholder="e.g., Morning Batch A"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Optional description"
              className="w-full rounded-xl border border-slate-300 p-3 mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Start Time</label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">End Time</label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full rounded-md border border-input px-3 py-2"
            >
              <option value="Daily">Daily</option>
              <option value="Monday-Friday">Monday - Friday</option>
              <option value="Weekend">Weekend</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">Max Students</label>
            <Input
              type="number"
              placeholder="40"
              value={maxStudents}
              onChange={(e) => setMaxStudents(e.target.value)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t pt-4 mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={saveBatch}>
            {selectedBatch ? "Update Batch" : "Save Batch"}
          </Button>
        </div>

      </div>
    </div>
  );
}