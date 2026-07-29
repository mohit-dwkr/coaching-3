import React, { useState } from 'react'
import { X, FileSpreadsheet, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";


interface ExportAttendanceModalProps {
  open: boolean;
  onClose: () => void;

  courses: any[];
  batches: any[];
  students: any[];

  onExportExcel: (
    reportType: string,
    courseId?: string,
    batchId?: string,
    studentId?: string,
    fromDate?: string,
    toDate?: string
  ) => void;

  onPrint: (
    reportType: string,
    courseId?: string,
    batchId?: string,
    studentId?: string,
    fromDate?: string,
    toDate?: string
  ) => void;
}



const ExportAttendanceModal = ({
  open,
  onClose,
  courses,
  batches,
  students,
  onExportExcel,
  onPrint,
}: ExportAttendanceModalProps) => {

const [reportType, setReportType] =
  useState("current");

const [selectedCourse, setSelectedCourse] =
  useState("all");

const [selectedBatch, setSelectedBatch] =
  useState("all");

const [selectedStudent, setSelectedStudent] =
  useState("all");

const [fromDate, setFromDate] =
  useState("");

const [toDate, setToDate] =
  useState("");


  const filteredStudents = students.filter((student) => {
  if (
    selectedCourse !== "all" &&
    student.course_id !== selectedCourse
  ) {
    return false;
  }

  if (
    selectedBatch !== "all" &&
    student.batch_id !== selectedBatch
  ) {
    return false;
  }
  return true;
});




if (!open) return null;
 return (

<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
<div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-xl">


<div className="flex justify-between items-center">
  <div>
    <h2 className="text-2xl font-black">
      Export Attendance
    </h2>

    <p className="text-slate-500 text-sm mt-1">
      Choose the report you want to export.
    </p>

  </div>
  <button onClick={onClose}>
    <X />
  </button>
</div>


{/* Report Type */}
<div className="mt-8">
  <label className="text-xs font-bold uppercase text-slate-500">
    Report Type
  </label>
  <select
    value={reportType}
    onChange={(e) =>
      setReportType(e.target.value)
    }
    className="w-full mt-2 border rounded-xl p-3"
  >

    <option value="current">
      Current View
    </option>

    <option value="complete">
      Complete Report
    </option>

    <option value="course">
      Course Report
    </option>

    <option value="batch">
      Batch Report
    </option>

    <option value="student">
      Student Report
    </option>

    <option value="present">
      Present Report
    </option>
    <option value="absent">
      Absent Report
    </option>
  </select>
</div>



{(
  reportType === "course" ||
  reportType === "batch" ||
  reportType === "student" ||
  reportType === "present" ||
  reportType === "absent"
) && (
<div className="mt-6">
<label className="text-xs font-bold uppercase text-slate-500">
Select Course
</label>

<select
value={selectedCourse}
onChange={(e)=>{
setSelectedCourse(e.target.value);
setSelectedBatch("all");
setSelectedStudent("all");
}}
className="w-full mt-2 border rounded-xl p-3"
>

<option value="all">
All Courses
</option>
{courses.map((course)=>(
<option
key={course.id}
value={course.id}
>
{course.course_name}
</option>
))}
</select>
</div>
)}



{(
  reportType === "batch" ||
  reportType === "student" ||
  reportType === "present" ||
  reportType === "absent"
) && (
<div className="mt-6">
<label className="text-xs font-bold uppercase text-slate-500">
Select Batch
</label>

<select
value={selectedBatch}
onChange={(e)=>{
setSelectedBatch(e.target.value);
setSelectedStudent("all");
}}
className="w-full mt-2 border rounded-xl p-3"
>

<option value="all">
All Batches
</option>

{batches
.filter(
(batch)=>
selectedCourse==="all" ||
batch.course_id===selectedCourse
)
.map((batch)=>(

<option
key={batch.id}
value={batch.id}
>

{batch.batch_name}

</option>
))}
</select>
</div>
)}



{reportType==="student" && (
<div className="mt-6">
<label className="text-xs font-bold uppercase text-slate-500">
Select Student
</label>
<select
value={selectedStudent}
onChange={(e)=>
setSelectedStudent(e.target.value)
}
className="w-full mt-2 border rounded-xl p-3"
>

<option value="all">
All Students
</option>

{filteredStudents.map((student)=>(

<option
key={student.id}
value={student.id}
>

{student.name}

</option>

))}
</select>
</div>
)}



{reportType !== "current" && (
<div className="mt-6 grid grid-cols-2 gap-4">
<div>
<label className="text-xs font-bold uppercase text-slate-500">
From Date
</label>
<input
type="date"
value={fromDate}
onChange={(e)=>
setFromDate(e.target.value)
}
className="w-full mt-2 border rounded-xl p-3"
/>

</div>

<div>

<label className="text-xs font-bold uppercase text-slate-500">
To Date
</label>

<input
type="date"
value={toDate}
onChange={(e)=>
setToDate(e.target.value)
}
className="w-full mt-2 border rounded-xl p-3"
/>
</div>
</div>
)}



<div className="flex justify-end gap-3 mt-8">
<Button
variant="outline"
onClick={onClose}
>
Cancel
</Button>
<Button
variant="outline"
onClick={()=>

onPrint(
reportType,
selectedCourse,
selectedBatch,
selectedStudent,
fromDate,
toDate
)

}
>
<Printer
className="mr-2"
size={16}
/>
Print
</Button>
<Button
onClick={()=>
onExportExcel(
reportType,
selectedCourse,
selectedBatch,
selectedStudent,
fromDate,
toDate
)

}
>
<FileSpreadsheet
className="mr-2"
size={16}
/>
Export Excel
</Button>
</div>


</div>
</div>
)
}

export default ExportAttendanceModal
