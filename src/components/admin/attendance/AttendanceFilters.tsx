import { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { Button } from "@/components/ui/button";

interface AttendanceFiltersProps {

  selectedCourse: string;
  setSelectedCourse: (value: string) => void;

  selectedBatch: string;
  setSelectedBatch: (value: string) => void;

  selectedDate: string;
  setSelectedDate: (value: string) => void;

  courses: any[];
  batches: any[];

  onTakeAttendance: () => void;
  onExport: () => void;
}

export default function AttendanceFilters({

  selectedCourse,
  setSelectedCourse,

  selectedBatch,
  setSelectedBatch,

  selectedDate,
  setSelectedDate,

  courses,
  batches,

  onTakeAttendance,
  onExport,

}: AttendanceFiltersProps) {



  return (
    <div className="bg-white rounded-[28px] border border-slate-200 p-6 shadow-sm">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Course */}
        <div>
          <label className="text-sm font-bold text-slate-600">
            Course
          </label>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full mt-2 h-11 rounded-xl border border-slate-300 px-3"
          >
            <option value="">Select Course</option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_name}
              </option>
            ))}

          </select>
        </div>

        {/* Batch */}
        <div>

          <label className="text-sm font-bold text-slate-600">
            Batch
          </label>

          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full mt-2 h-11 rounded-xl border border-slate-300 px-3"
          >

            <option value="">Select Batch</option>

            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.batch_name}
              </option>
            ))}

          </select>

        </div>

        {/* Date */}

        <div>

          <label className="text-sm font-bold text-slate-600">
            Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full mt-2 h-11 rounded-xl border border-slate-300 px-3"
          />
        </div>


        {/* Button */}
        <div className="md:col-span-4 flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            className="h-11 rounded-xl"
            onClick={onExport}
          >
            Export Report
          </Button>

          <Button
            className="h-11 rounded-xl font-bold"
            disabled={
              !selectedCourse ||
              !selectedBatch ||
              !selectedDate
            }
            onClick={onTakeAttendance}
          >
            Take Attendance
          </Button>
        </div>


      </div>
    </div>
  );
}