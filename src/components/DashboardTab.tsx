import DashboardStats from "./DashboardStats";
import AttendanceSection from "./AttendanceSection";
import FeeSection from "./FeeSection";
import {
    DashboardData,
    getStudentDashboardData,
} from "@/services/dashboardService";
import { useState, useEffect } from "react";

interface DashboardTabProps {
    profile: any;
    status: string | null;
}

export default function DashboardTab({
    profile,
    status,
}: DashboardTabProps) {



    const [dashboardData, setDashboardData] =
        useState<DashboardData | null>(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        if (!profile?.id) return;

        async function loadDashboard() {
            setLoading(true);

            const data =
                await getStudentDashboardData(profile.id);

            setDashboardData(data);

            setLoading(false);

        }

        loadDashboard();

    }, [profile]);




    if (loading) {

        return <div>Loading...</div>;

    }

    if (!dashboardData) {
        return null;
    }
    console.log(dashboardData);
    console.log(dashboardData.attendance);

    console.log("Current Attendance:", dashboardData.attendance);
    console.log("Attendance History:", dashboardData.attendanceHistory);

    return (

        <div className="space-y-6">

            <DashboardStats
                data={dashboardData}
            />

            <AttendanceSection
                data={dashboardData.attendance}
                history={dashboardData.attendanceHistory}
            />

            <FeeSection
                data={dashboardData.fees}
            />

        </div>

    );

}