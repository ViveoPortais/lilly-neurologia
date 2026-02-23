"use client";

import { motion } from "framer-motion";
import { FaBrain, FaRibbon } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import useSession from "@/hooks/useSession";
import { buildDashboardHref, ProgramSlug } from "@/helpers/routes";

interface ProgramSelectorProps {
  variant?: "mobile" | "desktop";
}

export function ProgramSelector({ variant = "desktop" }: ProgramSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useSession();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const programSlug = (pathname.includes("/oncologia") ? "oncologia" : "neurologia") as ProgramSlug;
  const hasMultiplePrograms = auth.programsCode && auth.programsCode.length > 1;

  if (!hasMultiplePrograms) return null;

  useEffect(() => {
    setIsTransitioning(false);
  }, [pathname]);

  const handleProgramChange = (programCode: string) => {
    const newSlug: ProgramSlug = programCode === "1001" ? "neurologia" : "oncologia";
    setIsTransitioning(true);
    auth.setProgramSlug(newSlug);
    auth.setProgramCode(programCode);
    router.push(buildDashboardHref(newSlug, "starts"));
  };

  const isMobile = variant === "mobile";
  const iconSize = isMobile ? 18 : 24;
  const gap = isMobile ? "gap-2" : "gap-3";

  return (
    <motion.div
      className={`flex ${gap} items-center`}
      initial={{ opacity: 1 }}
      animate={{ opacity: isTransitioning ? 0.5 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={() => handleProgramChange("1001")}
        className={`flex ${isMobile ? "items-center justify-center p-2" : "flex-col items-center gap-1 p-3"} rounded-lg transition-all ${
          programSlug === "neurologia"
            ? "bg-mainlilly text-white shadow-lg"
            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
        }`}
        title="Neurologia"
        whileHover={!isMobile ? { scale: 1.05 } : undefined}
        whileTap={{ scale: isMobile ? 0.9 : 0.95 }}
      >
        <FaBrain size={iconSize} />
        {!isMobile && <span className="text-xs font-semibold">Neurologia</span>}
      </motion.button>

      <motion.button
        onClick={() => handleProgramChange("995")}
        className={`flex ${isMobile ? "items-center justify-center p-2" : "flex-col items-center gap-1 p-3"} rounded-lg transition-all ${
          programSlug === "oncologia"
            ? "bg-mainlilly text-white shadow-lg"
            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
        }`}
        title="Oncologia"
        whileHover={!isMobile ? { scale: 1.05 } : undefined}
        whileTap={{ scale: isMobile ? 0.9 : 0.95 }}
      >
        <FaRibbon size={iconSize} />
        {!isMobile && <span className="text-xs font-semibold">Oncologia</span>}
      </motion.button>
    </motion.div>
  );
}
