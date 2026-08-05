// import React from "react";
// import { Card } from "@/components/ui/card";
// import { LucideIcon } from "lucide-react";

// interface AnalyticsCardProps {
//   title: string;
//   value: string | number;
//   subtitle: string;
//   icon: LucideIcon;
//   iconBgClass?: string;
//   iconColorClass?: string;
// }

// export default function AnalyticsCard({
//   title,
//   value,
//   subtitle,
//   icon: Icon,
//   iconBgClass = "bg-slate-100",
//   iconColorClass = "text-slate-700",
// }: AnalyticsCardProps) {
//   return (
//     <Card className="group relative border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden">
//       {/* Top Subtle Hover Accent Light */}
//       <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//       <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
//         {/* Content Area */}
//         <div className="space-y-2">
//           <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
//             {title}
//           </p>

//           <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
//             {value}
//           </h2>

//           <div className="flex items-center gap-1.5 pt-0.5">
//             <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600 group-hover:bg-blue-500 transition-colors" />
//             <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
//               {subtitle}
//             </p>
//           </div>
//         </div>

//         {/* Dynamic Icon Container */}
//         <div
//           className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-inner ${iconBgClass}`}
//         >
//           <Icon className={`h-6 w-6 stroke-[2.2] ${iconColorClass}`} />
//         </div>
//       </div>
//     </Card>
//   );
// }