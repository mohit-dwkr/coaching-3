import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  RefreshCw,
} from "lucide-react";
import FeeStructureSection from "./FeeStructureSection";
import StudentFeeSection from "./StudentFeeSection";



export default function FeesManager() {
  const [activeTab, setActiveTab] = useState<string>("structures");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);



  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };


  
const exportFees = () => {
};
const printFees = () => {
};



  return (
    <div className="w-full space-y-6 p-6 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      {/* Upper Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Fees Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure institutional pricing plans, track collections, and manage client-student financial statements.
          </p>
        </div>


        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={
                activeTab === "structures"
                  ? "Search configurations..."
                  : "Search student or batch..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background/50 focus-visible:ring-1 border-slate-200"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            className="h-10 w-10 shrink-0 border-slate-200 hover:bg-slate-50"
            title="Refresh Ledger Cache Data"
          >
            <RefreshCw className="h-4 w-4 text-slate-600" />
          </Button>
        </div>
      </div>


      {/* Primary Context Workspace Tabs */}
      <Tabs defaultValue="structures" value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <TabsList className="bg-slate-100/80 p-1 border border-slate-200/40 grid w-full max-w-[400px] grid-cols-2 rounded-lg">
          <TabsTrigger value="structures" className="rounded-md font-medium text-sm transition-all">
            Fee Structures
          </TabsTrigger>
          <TabsTrigger value="students" className="rounded-md font-medium text-sm transition-all">
            Student Fees
          </TabsTrigger>
        </TabsList>

        <TabsContent value="structures" className="outline-none focus-visible:ring-0">
          <FeeStructureSection searchQuery={searchQuery} refreshTrigger={refreshTrigger} />
        </TabsContent>

        <TabsContent value="students" className="outline-none focus-visible:ring-0">
          <StudentFeeSection searchQuery={searchQuery} refreshTrigger={refreshTrigger} />
        </TabsContent>
      </Tabs>






    </div>
  );
}