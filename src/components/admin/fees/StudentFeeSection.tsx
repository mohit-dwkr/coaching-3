import ExportFeesModal from "./ExportFeesModal";
import { exportToExcel } from "@/utils/exportExcel";
import { printTable } from "@/utils/printTable";
import { FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";


import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import { toast } from "sonner";
import StudentFeeTable from "./StudentFeeTable";
import StudentFeeDrawer from "./StudentFeeDrawer";
import UnassignedStudentTable from "./UnassignedStudentTable";
import AssignFeeDrawer from "./AssignFeeDrawer";
import FeeAnalyticsDashboard from "./analytics/FeeAnalyticsDashboard";
import StudentFeeFilters from "./StudentFeeFilters";

import {
  StudentFeeData,
  FeeStructure,
  FeeTransaction,
} from "./types";

import CollectPaymentDrawer from "./CollectPaymentDrawer/CollectPaymentDrawer";

interface StudentFeeSectionProps {
  searchQuery: string;
  refreshTrigger: number;
}

const StudentFeeSection = ({
  searchQuery,
  refreshTrigger,
}: StudentFeeSectionProps) => {
  const [studentFees, setStudentFees] = useState<StudentFeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<StudentFeeData | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [feeTransactions, setFeeTransactions] = useState<FeeTransaction[]>([]);

  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);

  const [filter, setFilter] = useState<
    "all" | "assigned" | "unassigned" | "overdue" | "partial" | "pending"
  >("all");

  const [isExportModalOpen, setIsExportModalOpen] =
    useState(false);


  const fetchFeeTransactions = useCallback(async () => {
    try {

      const { data, error } = await supabase
        .from("Coaching-3_FeeTransactions")
        .select("*")
        .order("transaction_date", {
          ascending: false,
        });

      if (error) throw error;

      return data || [];

    } catch (err: any) {
      toast.error(err.message);
      return [];
    }
  }, []);


  const fetchStudents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("Coaching-3_Students")
        .select(`
    id,
    name,
    email,
    mobile,
    class,
    batch_id,
    course_id,

    batch:batch_id(
      id,
      batch_name
    ),

    course:course_id(
      id,
      course_name
    )
  `);

      if (error) throw error;

      setStudents(data || []);
    } catch (err: any) {
      toast.error(err.message);
    }
  }, []);


  const fetchFeeStructures = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("Coaching-3_FeeStructures")
        .select("*")
        .eq("status", "active")
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      setFeeStructures(data || []);
    } catch (err: any) {
      toast.error(err.message);
    }
  }, []);


  const fetchStudentFees = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("Coaching-3_StudentFees")
        .select(`
    *,

 student:student_id(
  id,
  student_id,
  name,
  email,
  mobile,
  class,
  batch_id,
  course_id,

  batch:batch_id(
    id,
    batch_name,
    course_id
  )
),

course:course_id(
  id,
  course_name
),

fee_structure:fee_structure_id(
  *
)
  `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data || [];

    } catch (err: any) {
      toast.error(err.message || "Failed to load student fees.");
      return [];
    }
  }, []);


  const refreshData = useCallback(async () => {
    setLoading(true);

    try {
      const [
        latestFees,
        latestTransactions,
      ] = await Promise.all([
        fetchStudentFees(),
        fetchFeeTransactions(),
        fetchFeeStructures(),
        fetchStudents(),
      ]);

      // Update table
      setStudentFees(latestFees);
      setFeeTransactions(latestTransactions);

      // Agar drawer open hai to selected student bhi update karo
      if (selectedFee) {
        const updatedFee = latestFees.find(
          (fee) => fee.id === selectedFee.id
        );
        if (updatedFee) {
          setSelectedFee(updatedFee);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [
    fetchStudentFees,
    fetchFeeTransactions,
    fetchFeeStructures,
    fetchStudents,
  ]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);


  const replaceStudentFee = useCallback(
    (updatedFee: StudentFeeData) => {
      // Table update
      setStudentFees((prev) =>
        prev.map((fee) =>
          fee.id === updatedFee.id ? updatedFee : fee
        )
      );

      // Drawer update
      setSelectedFee((prev) => {
        if (!prev) return null;

        return prev.id === updatedFee.id
          ? updatedFee
          : prev;
      });
    },
    []
  );


  const handleSaveFee = async (
    updatedFee: StudentFeeData
  ) => {
    try {
      const { error } = await supabase
        .from("Coaching-3_StudentFees")
        .update({
          fee_structure_id: updatedFee.fee_structure_id,
          total_fee: updatedFee.total_fee,
          discount: updatedFee.discount,
          final_fee: updatedFee.final_fee,
          paid_amount: updatedFee.paid_amount,
          remaining_amount: updatedFee.remaining_amount,
          next_due_date: updatedFee.next_due_date,
          status: updatedFee.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedFee.id);

      if (error) throw error;
      replaceStudentFee(updatedFee);
    } catch (err: any) {
      toast.error(err.message || "Failed to update fee.");
      throw err;
    }
  };


  const assignedIds = new Set(
    studentFees.map((fee) => fee.student_id)
  );

  const unassignedStudents = students.filter(
    (student) => !assignedIds.has(student.id)
  );


  const assignedCount = studentFees.length;

  const unassignedCount = unassignedStudents.length;

  const totalCount =
    assignedCount + unassignedCount;


  const overdueCount = studentFees.filter(
    (fee) => fee.status === "Overdue"
  ).length;

  const pendingCount = studentFees.filter(
    (fee) => fee.status === "Pending"
  ).length;

  const partialCount = studentFees.filter(
    (fee) => fee.status === "Partial"
  ).length;



  const filteredStudentFees = (() => {
    switch (filter) {
      case "assigned":
        return studentFees;

      case "overdue":
        return studentFees.filter(
          (fee) => fee.status === "Overdue"
        );

      case "partial":
        return studentFees.filter(
          (fee) => fee.status === "Partial"
        );

      case "pending":
        return studentFees.filter(
          (fee) => fee.status === "Pending"
        );

      default:
        return studentFees;
    }
  })();


  const courses = [
    ...new Map(
      studentFees
        .filter((f) => f.course)
        .map((f) => [
          f.course.id,
          f.course,
        ])
    ).values(),
  ];

  const batches = [
    ...new Map(
      studentFees
        .filter((f) => f.student?.batch)
        .map((f) => [
          f.student.batch.id,
          f.student.batch,
        ])
    ).values(),
  ];
  console.log("Batches:", batches);


  const mapFee = (fee: StudentFeeData) => ({
    "Student Name": fee.student?.name || "",
    "Student ID": fee.student?.student_id || "",
    "Mobile": fee.student?.mobile || "",
    "Course": fee.course?.course_name || "",
    "Batch": fee.student?.batch?.batch_name || "",

    "Course Fee": fee.course_fee,
    "Admission Fee": fee.admission_fee,
    "Registration Fee": fee.registration_fee,
    "Duration (Months)": fee.duration_months,

    "Total Fee": fee.total_fee,
    "Discount": fee.discount,
    "Final Fee": fee.final_fee,
    "Paid Amount": fee.paid_amount,
    "Remaining Amount": fee.remaining_amount,

    "Status": fee.status,
    "Next Due Date": fee.next_due_date || "",
  });


  const mapTransaction = (transaction: FeeTransaction) => {

    const fee = studentFees.find(
      (f) => f.id === transaction.student_fee_id
    );

    return {

      "Student Name":
        fee?.student?.name || "",

      "Student ID":
        fee?.student?.student_id || "",

      "Course":
        fee?.course?.course_name || "",

      "Batch":
        fee?.student?.batch?.batch_name || "",

      "Amount":
        transaction.amount,

      "Payment Mode":
        transaction.payment_mode,

      "Receipt No":
        transaction.receipt_no || "",

      "Transaction Date":
        transaction.transaction_date,

      "Received By":
        transaction.received_by || "",

      "Reference No":
        transaction.transaction_id || "",

      "Remarks":
        transaction.remark || "",
    };

  };


  const exportFees = (
    reportType: string,
    courseId?: string,
    batchId?: string,
    studentId?: string,
    fromDate?: string,
    toDate?: string
  ) => {

    let exportData = [...filteredStudentFees];

    switch (reportType) {

      case "current":
        exportData = filteredStudentFees;
        break;

      case "complete":
        exportData = [...studentFees];
        break;


      case "course": {
        exportData = studentFees.filter((fee) => {
          const courseMatch =
            courseId === "all" ||
            fee.course_id === courseId;

          const date =
            fee.admission_date || "";

          const fromMatch =
            !fromDate ||
            date >= fromDate;

          const toMatch =
            !toDate ||
            date <= toDate;

          return (
            courseMatch &&
            fromMatch &&
            toMatch
          );
        });
        break;
      }


      case "batch":
        exportData = [...studentFees];
        // Course Filter
        if (courseId && courseId !== "all") {
          exportData = exportData.filter(
            fee => fee.course_id === courseId
          );
        }
        // Batch Filter
        if (batchId && batchId !== "all") {
          exportData = exportData.filter(
            fee => fee.student?.batch_id === batchId
          );
        }
        break;


      case "pending":
        exportData = studentFees.filter(
          fee => fee.status === "Pending"
        );
        break;



      case "paid":
        exportData = [...studentFees];
        // Sirf Paid
        exportData = exportData.filter(
          fee => fee.status === "Paid"
        );
        // Course Filter
        if (courseId && courseId !== "all") {
          exportData = exportData.filter(
            fee => fee.course_id === courseId
          );
        }
        // Batch Filter
        if (batchId && batchId !== "all") {
          exportData = exportData.filter(
            fee => fee.student?.batch_id === batchId
          );
        }
        break;



      case "collection":
        break;;

      default:
        exportData = studentFees;
    }

    //  batch report 
    if (
      reportType === "batch" &&
      (fromDate || toDate)
    ) {
      exportData = exportData.filter((fee) => {

        if (!fee.created_at) return false;

        const feeDate = fee.created_at.split("T")[0];

        if (fromDate && feeDate < fromDate) {
          return false;
        }

        if (toDate && feeDate > toDate) {
          return false;
        }

        return true;
      });
    }

    //  paid report

    if (
      reportType === "paid" &&
      (fromDate || toDate)
    ) {
      exportData = exportData.filter((fee) => {

        if (!fee.created_at) return false;

        const feeDate = fee.created_at.split("T")[0];

        if (fromDate && feeDate < fromDate)
          return false;

        if (toDate && feeDate > toDate)
          return false;

        return true;
      });
    }


    //  complete report

    if (
      reportType === "complete" &&
      (fromDate || toDate)
    ) {
      exportData = exportData.filter((fee) => {

        if (!fee.created_at) return false;

        const feeDate = fee.created_at.split("T")[0];

        if (fromDate && feeDate < fromDate) {
          return false;
        }

        if (toDate && feeDate > toDate) {
          return false;
        }
        return true;
      });
    }

    let collectionData = [...feeTransactions];

    // Course Filter
    if (courseId && courseId !== "all") {
      collectionData = collectionData.filter((transaction) => {
        const fee = studentFees.find(
          (f) => f.id === transaction.student_fee_id
        );
        return fee?.course_id === courseId;
      });
    }

    // Batch Filter
    if (batchId && batchId !== "all") {
      collectionData = collectionData.filter((transaction) => {
        const fee = studentFees.find(
          (f) => f.id === transaction.student_fee_id
        );
        return fee?.student?.batch_id === batchId;
      });
    }

    if (reportType === "collection") {

      // Date From
      if (fromDate) {

        collectionData = collectionData.filter(
          transaction =>
            transaction.transaction_date >= fromDate
        );

      }
      // Date To
      if (toDate) {

        collectionData = collectionData.filter(
          transaction =>
            transaction.transaction_date <= toDate
        );
      }

      if (!collectionData.length) {
        toast.error("No records found.");
        return;
      }
      exportToExcel({
        fileName: `Collection_Report_${new Date().toLocaleDateString()}`,
        sheets: [
          {
            sheetName: "Collection Report",
            data: collectionData.map(mapTransaction),
          },
        ],
      });
      toast.success(
        "Collection report exported successfully."
      );
      return;
    }


    // history report 
    if (reportType === "history") {

      let historyData = [...feeTransactions];

      // Course Filter
      if (courseId && courseId !== "all") {
        historyData = historyData.filter((transaction) => {
          const fee = studentFees.find(
            (f) => f.id === transaction.student_fee_id
          );
          return fee?.course_id === courseId;
        });
      }

// Batch Filter
if (batchId && batchId !== "all") {
  historyData = historyData.filter((transaction) => {
    const fee = studentFees.find(
      (f) => f.id === transaction.student_fee_id
    );
    return fee?.student?.batch_id === batchId;
  });
}


    // Student Filter
if (studentId && studentId !== "all") {
  historyData = historyData.filter((transaction) => {
    const fee = studentFees.find(
      (f) => f.id === transaction.student_fee_id
    );
    return (
      String(fee?.student?.id) ===
      String(studentId)
    );
  });
}

// From Date
if (fromDate) {
  historyData = historyData.filter(
    (transaction) =>
      transaction.transaction_date >= fromDate
  );
}

// To Date
if (toDate) {
  historyData = historyData.filter(
    (transaction) =>
      transaction.transaction_date <= toDate
  );
}

      if (!historyData.length) {
        toast.error("No payment history found.");
        return;
      }
      exportToExcel({
        fileName: `Payment_History_${new Date().toLocaleDateString()}`,
        sheets: [
          {
            sheetName: "Payment History",
            data: historyData.map(mapTransaction),
          },
        ],
      });
      toast.success("Payment history exported successfully.");
      return;
    }
    if (!exportData.length) {
      toast.error("No records found.");
      return;
    }

    

    const sheets: any[] = [];
    // Main sheet
    sheets.push({
      sheetName: "Fees Report",
      data: exportData.map(mapFee),
    });

    // completee report 

    if (reportType === "complete") {

      // Course Wise
      courses.forEach((course) => {
        sheets.push({
          sheetName: `Course - ${course.course_name}`,
          data: exportData
            .filter(
              fee => fee.course_id === course.id
            )
            .map(mapFee),
        });
      });

      // Batch Wise
      batches.forEach((batch) => {
        sheets.push({
          sheetName: `Batch - ${batch.batch_name}`,
          data: exportData
            .filter(
              fee =>
                fee.student?.batch_id === batch.id
            )
            .map(mapFee),
        });
      });

      // Pending
      sheets.push({
        sheetName: "Pending Fees",
        data: exportData
          .filter(
            fee => fee.status === "Pending"
          )
          .map(mapFee),
      });

      // Paid
      sheets.push({
        sheetName: "Paid Students",
        data: exportData
          .filter(
            fee => fee.status === "Paid"
          )
          .map(mapFee),
      });

      // Partial
      sheets.push({
        sheetName: "Partial Fees",
        data: exportData
          .filter(
            fee => fee.status === "Partial"
          )
          .map(mapFee),
      });

      // Collection Report
      sheets.push({
        sheetName: "Collection Report",
        data: collectionData.map(mapTransaction),
      });
    }
    exportToExcel({
      fileName: `Fees_Report_${new Date().toLocaleDateString()}`,
      sheets,
    });
    toast.success("Fees report exported successfully.");
  };



const printFees = (
  reportType: string,
  courseId?: string,
  batchId?: string,
  studentId?: string,
  fromDate?: string,
  toDate?: string
) => {

let exportData = [...filteredStudentFees];
let collectionData = [...feeTransactions];

let historyData = [...feeTransactions];

switch (reportType) {

  case "current":
    exportData = filteredStudentFees;
    break;

  case "complete":
    exportData = [...studentFees];
    break;

  default:
    exportData = [...studentFees];
}


  if (reportType === "current") {

    const rows = filteredStudentFees.map(mapFee);

    if (!rows.length) {
      toast.error("No records found.");
      return;
    }

    printTable(
      "Current Fees Report",
      Object.keys(rows[0]),
      rows

      
    );
    return;
  }

if (reportType === "complete") {

  const rows = exportData.map(mapFee);

  if (!rows.length) {
    toast.error("No records found.");
    return;
  }
  printTable(
    "Complete Fees Report",
    Object.keys(rows[0]),
    rows
  );
  return;
}


if (reportType === "course") {

  let rows = studentFees
    .filter((fee) => {

      const courseMatch =
        courseId === "all" ||
        fee.course_id === courseId;

      const date =
        fee.admission_date || "";

      const fromMatch =
        !fromDate ||
        date >= fromDate;

      const toMatch =
        !toDate ||
        date <= toDate;

      return (
        courseMatch &&
        fromMatch &&
        toMatch
      );
    })
    .map(mapFee);

  if (!rows.length) {
    toast.error("No records found.");
    return;
  }

  printTable(
    "Course Report",
    Object.keys(rows[0]),
    rows
  );

  return;
}


if (reportType === "batch") {

  let rows = studentFees
    .filter((fee) => {

      if (
        courseId &&
        courseId !== "all" &&
        fee.course_id !== courseId
      ) {
        return false;
      }

      if (
        batchId &&
        batchId !== "all" &&
        fee.student?.batch_id !== batchId
      ) {
        return false;
      }

      if (!fee.created_at) return false;

      const feeDate =
        fee.created_at.split("T")[0];

      if (fromDate && feeDate < fromDate)
        return false;

      if (toDate && feeDate > toDate)
        return false;

      return true;

    })
    .map(mapFee);

  if (!rows.length) {
    toast.error("No records found.");
    return;
  }

  printTable(
    "Batch Report",
    Object.keys(rows[0]),
    rows
  );

  return;
}


if (reportType === "pending") {

  const rows = studentFees
    .filter(
      fee => fee.status === "Pending"
    )
    .map(mapFee);

  if (!rows.length) {
    toast.error("No records found.");
    return;
  }

  printTable(
    "Pending Fees Report",
    Object.keys(rows[0]),
    rows
  );

  return;
}


if (reportType === "paid") {

  let rows = studentFees
    .filter((fee) => {

      if (fee.status !== "Paid")
        return false;

      if (
        courseId &&
        courseId !== "all" &&
        fee.course_id !== courseId
      ) {
        return false;
      }

      if (
        batchId &&
        batchId !== "all" &&
        fee.student?.batch_id !== batchId
      ) {
        return false;
      }

      if (!fee.created_at) return false;

      const feeDate =
        fee.created_at.split("T")[0];

      if (fromDate && feeDate < fromDate)
        return false;

      if (toDate && feeDate > toDate)
        return false;

      return true;

    })
    .map(mapFee);

  if (!rows.length) {
    toast.error("No records found.");
    return;
  }

  printTable(
    "Paid Fees Report",
    Object.keys(rows[0]),
    rows
  );

  return;
}


if (reportType === "collection") {

  let rows = collectionData
    .map(mapTransaction);

  if (!rows.length) {
    toast.error("No records found.");
    return;
  }

  printTable(
    "Collection Report",
    Object.keys(rows[0]),
    rows
  );

  return;
}


if (reportType === "history") {

  let rows = historyData
    .map(mapTransaction);

  if (!rows.length) {
    toast.error("No payment history found.");
    return;
  }

  printTable(
    "Payment History",
    Object.keys(rows[0]),
    rows
  );

  return;
}

};

return (
  <div className="space-y-8 animate-in fade-in duration-300">
    {/* Top Bar Action (Export Button) */}
    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
          Student Fee Management
        </h2>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Monitor collections, manage student ledgers, and export financial audit logs.
        </p>
      </div>

      <Button
        onClick={() => setIsExportModalOpen(true)}
        className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all"
      >
        <FileSpreadsheet className="h-4 w-4 stroke-[2.2]" />
        <span>Export Report</span>
      </Button>
    </div>

    {/* Analytics Dashboard Component */}
    <FeeAnalyticsDashboard
      studentFees={studentFees}
      feeTransactions={feeTransactions}
    />

    {/* Student Fee Filters */}
    <StudentFeeFilters
      filter={filter}
      onFilterChange={setFilter}
      totalCount={totalCount}
      assignedCount={assignedCount}
      unassignedCount={unassignedCount}
      pendingCount={pendingCount}
      overdueCount={overdueCount}
      partialCount={partialCount}
    />

    {/* Main Assigned Student Fee Table */}
    {filter !== "unassigned" && (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden p-1">
        <StudentFeeTable
          items={filteredStudentFees}
          loading={loading}
          onEdit={(fee) => {
            setSelectedFee(fee);
            setDrawerOpen(true);
          }}
          onCollect={(fee) => {
            setSelectedFee(fee);
            setPaymentDrawerOpen(true);
          }}
          onDelete={() => {}}
        />
      </div>
    )}

    {/* Unassigned Students Section */}
    {(filter === "all" || filter === "unassigned") && (
      <div className="space-y-3 pt-2">
        {filter === "all" && (
          <div>
        
          </div>
        )}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden p-1">
          <UnassignedStudentTable
            items={unassignedStudents}
            loading={loading}
            onAssignFee={(student) => {
              setSelectedStudent(student);
              setAssignDrawerOpen(true);
            }}
          />
        </div>
      </div>
    )}

    {/* Student Fee Edit Drawer */}
    <StudentFeeDrawer
      isOpen={drawerOpen}
      onClose={() => {
        setDrawerOpen(false);
        setSelectedFee(null);
        setSelectedStudent(null);
      }}
      studentFee={selectedFee}
      feeStructures={feeStructures}
      onSave={handleSaveFee}
      onDataChanged={async () => {
        await refreshData();
      }}
    />

    {/* Assign Fee Drawer */}
    <AssignFeeDrawer
      isOpen={assignDrawerOpen}
      onClose={() => {
        setAssignDrawerOpen(false);
        setSelectedStudent(null);
      }}
      student={selectedStudent}
      onAssigned={async () => {
        await refreshData();
        setAssignDrawerOpen(false);
        setSelectedStudent(null);
      }}
    />

    {/* Payment Collection Drawer */}
    <CollectPaymentDrawer
      isOpen={paymentDrawerOpen}
      onClose={() => {
        setPaymentDrawerOpen(false);
        setSelectedFee(null);
      }}
      studentFee={selectedFee}
      onPaymentSuccess={async () => {
        await refreshData();
      }}
    />

    {/* Export Modal */}
    <ExportFeesModal
      open={isExportModalOpen}
      onClose={() => setIsExportModalOpen(false)}
      courses={courses}
      batches={batches}
      students={
        [
          ...new Map(
            feeTransactions
              .map((transaction) => {
                const fee = studentFees.find(
                  (f) => f.id === transaction.student_fee_id
                );
                return fee?.student;
              })
              .filter(Boolean)
              .map((student) => [student!.id, student])
          ).values(),
        ]
      }
      onExportExcel={exportFees}
      onPrint={printFees}
    />
  </div>
);}

export default StudentFeeSection