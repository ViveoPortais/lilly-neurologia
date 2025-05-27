"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExamPendingModel } from "@/types/diagnostic";

export default function RedirectToScheduleSample({ item }: { item: ExamPendingModel }) {
 const router = useRouter();

 useEffect(() => {
  if (item?.numberProtocol) {
   router.push(`/schedule-sample?protocolo=${item.numberProtocol}`);
  }
 }, [item, router]);

 return null;
}
