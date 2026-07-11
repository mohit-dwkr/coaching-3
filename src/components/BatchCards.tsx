import { motion, AnimatePresence } from "framer-motion";
import { Clock, IndianRupee, ChevronDown, ChevronUp, Sparkles, GraduationCap, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/supabaseClient";
import { useQuery } from "@tanstack/react-query";

// ✅ Type added
type BatchType = {
  id: string;
  class_name: string;
  subjects: string;
  start_time: string;
  end_time: string;
  price: number;
};

export default function BatchCards() {
  const [showAll, setShowAll] = useState(false);

  // ✅ Fetch + Cache (1 hour)
  const { data: batches = [], isError } = useQuery<BatchType[]>({
    queryKey: ["batches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Coaching-3_Batches")
        .select("id, class_name, subjects, start_time, end_time, price")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });

  // ✅ Optional error UI
  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load batches
      </div>
    );
  }

  const displayedBatches = showAll ? batches : batches.slice(0, 6);

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const academicSession = `${currentYear}-${nextYear.toString().slice(-2)}`;

  return (
    <section id="batches" className="relative py-56 pb-20 bg-[#f8faff] overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-blue-500 text-white text-sm font-bold mb-6 border border-blue-500 shadow-sm transition-all hover:bg-blue-600">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span className="tracking-wide uppercase">
              Admissions Open {academicSession}
            </span>
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            Our <span className=" text-blue-600">Target Batches</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed">
            "High-Performance Courses for Navodaya Entrance Preparation with Expert Guidance and Proven Results"
          </p>
        </motion.div>


{/* --- CARDS SECTION START (EXACT HTML/CSS CUSTOM DESIGN RE-ENGINEERED IN TAILWIND) --- */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[28px]">
  <AnimatePresence mode="popLayout">
    {displayedBatches.map((b, i) => {
      // 1. Static Premium Images Array for Premium Look
      const staticImages = [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop"
      ];

      // 2. Dynamic Vertical Gradient Tint Layouts (Aapki CSS logic ke mutabik)
      const cardTints = [
        "bg-gradient-to-b from-[#ffffff] via-[#ffffff] to-[#f0f4ff]", // card-rms
        "bg-gradient-to-b from-[#ffffff] via-[#ffffff] to-[#fff7ed]", // card-shramodaya
        "bg-gradient-to-b from-[#ffffff] via-[#ffffff] to-[#f0fdf4]"  // card-sainik
      ];
      const currentTint = cardTints[i % cardTints.length];

      // 3. Dynamic Accent Badges Design (Top Left Corner on Image)
      const badges = [
        { text: "Popular", bg: "bg-[#ea580c]" },
        { text: "Best Seller", bg: "bg-[#ea580c]" },
        { text: "New Batch", bg: "bg-[#16a34a]" }
      ];
      const currentBadge = badges[i % badges.length];

      return (
        <motion.div
          key={b.id}
          layout
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          whileHover={{ 
            y: -8, 
            boxShadow: "0 25px 50px rgba(51, 102, 255, 0.1)",
            borderColor: "rgba(51, 102, 255, 0.25)"
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`group flex flex-col rounded-[24px] overflow-hidden border border-[#e2e8f0] shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all duration-300 ${currentTint}`}
        >
          {/* IMAGE WORK - TOP BANNER POSITION */}
          <div className="relative w-full h-[200px] overflow-hidden">
            <img 
              src={staticImages[i % staticImages.length]} 
              alt="Coaching Batch" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Displaying condition for badge since 2nd index had it commented in HTML */}
            {i % 3 !== 1 && (
              <div className={`absolute top-4 left-4 text-white px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-[0.5px] shadow-[0_4px_10px_rgba(0,0,0,0.15)] z-10 ${currentBadge.bg}`}>
                {currentBadge.text}
              </div>
            )}
          </div>

          {/* PREMIUM INTERNAL CONTENT */}
          <div className="p-7 flex flex-col flex-grow">
            <div className="course-header">
              {/* --- SUBJECT HEADER IS COMMENTED OUT AS REQUESTED --- */}
              <h3 className="text-[22px] text-[#0f172a] font-bold leading-[1.3]">{b.subjects}</h3>
              <p className="mt-2.5 text-[#64748b] text-[14px] mechanics-p leading-[1.6]">
                Complete preparation batch with study material.
              </p>
            </div>

            {/* 2x2 GRID INSIDE CARD CONTENT */}
            <div className="grid grid-cols-2 gap-3.5 mt-6">
              {/* Class Info Box */}
              <div className="bg-white/80 border border-[#e2e8f0]/90 p-3.5 px-3.5 rounded-[14px] flex items-center gap-3 transition-all duration-300 group-hover:bg-white group-hover:border-[#3366ff]/15 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <div className="text-[#3366ff] text-base bg-[#3366ff]/[0.06] w-9 h-9 flex items-center justify-center rounded-[10px] shrink-0">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[#94a3b8] text-[11px] font-semibold uppercase block">Class</span>
                  <h4 className="text-[#334155] text-[10px]  md:text-[14px] font-bold mt-0.5 truncate">{b.class_name}</h4>
                </div>
              </div>

              {/* Timing Info Box */}
              <div className="bg-white/80 border border-[#e2e8f0]/90 p-3.5 px-3.5 rounded-[14px] flex items-center gap-3 transition-all duration-300 group-hover:bg-white group-hover:border-[#3366ff]/15 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <div className="text-[#3366ff] text-base bg-[#3366ff]/[0.06] w-9 h-9 flex items-center justify-center rounded-[10px] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[#94a3b8] text-[11px] font-semibold uppercase block">Timing</span>
                  <h4 className="text-[#334155] text-[10px] md:text-[14px] font-bold mt-0.5 truncate">{b.start_time}  {b.end_time}</h4>
                </div>
              </div>

              {/* Duration Box */}
              <div className="bg-white/80 border border-[#e2e8f0]/90 p-3.5 px-3.5 rounded-[14px] flex items-center gap-3 transition-all duration-300 group-hover:bg-white group-hover:border-[#3366ff]/15 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <div className="text-[#3366ff] text-base bg-[#3366ff]/[0.06] w-9 h-9 flex items-center justify-center rounded-[10px] shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[#94a3b8] text-[11px] font-semibold uppercase block">Duration</span>
                  <h4 className="text-[#334155] text-[10px]  md:text-[14px] font-bold mt-0.5 truncate">12 Months</h4>
                </div>
              </div>

              {/* Seats Box */}
              <div className="bg-white/80 border border-[#e2e8f0]/90 p-3.5 px-3.5 rounded-[14px] flex items-center gap-3 transition-all duration-300 group-hover:bg-white group-hover:border-[#3366ff]/15 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                <div className="text-[#3366ff] text-base bg-[#3366ff]/[0.06] w-9 h-9 flex items-center justify-center rounded-[10px] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[#94a3b8] text-[11px] font-semibold uppercase block">Seats</span>
                  <h4 className="text-[#334155] text-[10px]  md:text-[14px] font-bold mt-0.5 truncate">50 Students</h4>
                </div>
              </div>
            </div>

            {/* CARD BOTTOM SPLIT */}
            <div className="mt-7 pt- border-t border-dashed border-[#e2e8f0] flex justify-between items-center">
              <div className="text-[26px] text-[#0f172a] font-bold">
                <span className="text-[20px] text-[#3366ff] font-bold">₹</span>
                {b.price}
                <span className="text-[13px] text-[#64748b] font-medium">/mo</span>
              </div>
              <Button 
                className="bg-[#3366ff] hover:bg-[#1d4ed8] text-white px-6 py-3 h-auto rounded-[12px] text-[14px] font-bold transition-all duration-200 shadow-[0_4px_14px_rgba(51,102,255,0.2)] hover:shadow-[0_6px_18px_rgba(51,102,255,0.35)] hover:-translate-y-0.5 active:translate-y-0"
                asChild
              >
                <a href="#contact">Enroll Now</a>
              </Button>
            </div>
          </div>
        </motion.div>
      );
    })}
  </AnimatePresence>
</div>
{/* --- CARDS SECTION END --- */}

        {batches.length > 6 && (
          <div className="mt-16 text-center">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => setShowAll(!showAll)}
              className="h-14 rounded-full px-10 border-2 border-gray-200 text-gray-700 font-bold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 shadow-sm"
            >
              {showAll ? (
                <>Show Less<ChevronUp className="ml-2 h-5 w-5" /></>
              ) : (
                <>Show More<ChevronDown className="ml-2 h-5 w-5" /></>
              )}
            </Button>
          </div>
        )}

        {batches.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium">No active batches at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}