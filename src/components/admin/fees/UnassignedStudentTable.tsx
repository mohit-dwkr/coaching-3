import { Button } from '@/components/ui/button';
import React from 'react'


interface UnassignedStudentTableProps {
  items: any[];
  loading: boolean;
  onAssignFee: (student: any) => void;
}

const UnassignedStudentTable = ({
  items,
  loading,
  onAssignFee,
}: UnassignedStudentTableProps) => {

    if (loading) {
  return <div>Loading...</div>;
}

if (items.length === 0) {
  return (
    <div className="text-center py-10 text-slate-500">
      All students already have fee structures assigned.
    </div>
  );
}

  return (

    
    

  <table className="w-full">
    <thead>
      <tr>
        <th>Student</th>
        <th>Course</th>
        <th>Batch</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {items.map((student) => (
        <tr key={student.id}>
          <td>{student.name}</td>
          <td>{student.course?.course_name ?? "-"}</td>
          <td>{student.batch?.batch_name ?? "-"}</td>

          <td>
     <Button
  size="sm"
  onClick={() => {
    onAssignFee(student);
  }}
>
  Assign Fee
</Button>

          </td>
        </tr>
      ))}
    </tbody>
  </table>
);
}

export default UnassignedStudentTable
