import React from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconBgClass?: string;
  iconColorClass?: string;
}

export default function AnalyticsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgClass = "bg-slate-100",
  iconColorClass = "text-slate-700",
}: AnalyticsCardProps) {
  return (
    <Card className="border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl bg-white">

      <div className="p-5 flex items-start justify-between">

        <div className="space-y-2">

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>

          <p className="text-xs text-slate-500">
            {subtitle}
          </p>

        </div>

        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center ${iconBgClass}`}
        >
          <Icon className={`h-6 w-6 ${iconColorClass}`} />
        </div>

      </div>

    </Card>
  );
}