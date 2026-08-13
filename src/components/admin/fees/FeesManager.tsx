import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  RefreshCw,
  Receipt,
  Users,
  Wallet,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FeeStructureSection from "./FeeStructureSection";
import StudentFeeSection from "./StudentFeeSection";



export default function FeesManager() {
  const [activeTab, setActiveTab] = useState<string>("students");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);



  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };



  const exportFees = () => {
  };
  const printFees = () => {
  };

  const filteredBatches =
    selectedCourse === "all"
      ? batches
      : batches.filter(
        (batch) =>
          batch.course_id === selectedCourse
      );

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto animate-in fade-in duration-300">

      {/* Upper Top Header Card (Matching Student Manager Style) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">

        {/* Title & Top Bar Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Heading + Icon */}
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-blue-600/10 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
              <Wallet className="h-7 w-7 text-blue-600" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                  Fees Manager
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                  Pro Suite
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
                Configure institutional pricing plans, track collections, and manage client-student financial statements.
              </p>
            </div>
          </div>

          {/* Action Controls (Search Bar & Refresh Button) */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <div className="relative w-full sm:w-72 md:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <Input
                placeholder={
                  activeTab === "structures"
                    ? "Search configurations..."
                    : "Search student or batch..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-slate-50/80 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800 focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 rounded-xl text-sm transition-all font-medium"
              />
            </div>


            <Select
              value={selectedCourse}
              onValueChange={(value) => {
                setSelectedCourse(value);
                setSelectedBatch("all");
              }}
            >
              <SelectTrigger className="w-52 h-11 rounded-xl">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  All Courses
                </SelectItem>

                {courses.map((course) => (
                  <SelectItem
                    key={course.id}
                    value={course.id}
                  >
                    {course.course_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


            <Select
              value={selectedBatch}
              onValueChange={setSelectedBatch}
            >
              <SelectTrigger className="w-52 h-11 rounded-xl">
                <SelectValue placeholder="All Batches" />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="all">
                  All Batches
                </SelectItem>

                {filteredBatches.map((batch) => (
                  <SelectItem
                    key={batch.id}
                    value={batch.id}
                  >
                    {batch.batch_name}
                  </SelectItem>
                ))}

              </SelectContent>
            </Select>


            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="h-11 w-11 shrink-0 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all active:scale-95 shadow-sm"
              title="Refresh Ledger Cache Data"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

      </div>

      {/* Primary Context Workspace Tabs (Image Pill Design) */}
      <Tabs
        defaultValue="structures"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        <TabsList className="bg-slate-100 dark:bg-slate-900 p-1.5 border border-slate-200/60 dark:border-slate-800 inline-flex w-full sm:w-auto grid-cols-2 rounded-2xl backdrop-blur-sm gap-1 h-auto">
          <TabsTrigger
            value="students"
            className="rounded-xl font-bold text-xs sm:text-sm px-5 py-2.5 text-slate-600 dark:text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Users className="h-4 w-4" />
            Student Fees
          </TabsTrigger>

          <TabsTrigger
            value="structures"
            className="rounded-xl font-bold text-xs sm:text-sm px-5 py-2.5 text-slate-600 dark:text-slate-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Receipt className="h-4 w-4" />
            Fee Structures
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="structures"
          className="outline-none focus-visible:ring-0 mt-0"
        >
          <FeeStructureSection
            searchQuery={searchQuery}
            refreshTrigger={refreshTrigger}
          />
        </TabsContent>

        <TabsContent
          value="students"
          className="outline-none focus-visible:ring-0 mt-0"
        >
          <StudentFeeSection
            searchQuery={searchQuery}
            selectedCourse={selectedCourse}
            selectedBatch={selectedBatch}
            refreshTrigger={refreshTrigger}

            onCoursesChange={setCourses}
            onBatchesChange={setBatches}
          />
        </TabsContent>
      </Tabs>

    </div>
  );
}