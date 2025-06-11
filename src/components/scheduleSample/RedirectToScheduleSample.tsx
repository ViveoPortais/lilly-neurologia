"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ExamPendingModel } from "@/types/diagnostic";
import { fetchCollectionSchedule, setSelectedExamItem } from "@/store/slices/pendingsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function RedirectToScheduleSample({ item }: { item: ExamPendingModel }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const selectedDoctorId = useAppSelector((state) => state.registerPatient.selectedDoctorId);

  useEffect(() => {
    if (!item?.id) return;
    dispatch(setSelectedExamItem(item));

    if (pathname.includes("pending")) {
      const queryParams = new URLSearchParams({ examId: item.id });

      if (selectedDoctorId) {
        queryParams.set("selectedDoctorId", selectedDoctorId);
      }

      router.push(`/dashboard/schedule-sample?${queryParams.toString()}`);
    } else {
      dispatch(fetchCollectionSchedule(item.id));
    }
  }, [item, pathname, router, dispatch]);

  return null;
}