"use client";
import { CustomFilterSelect } from "@/components/custom/CustomFilterSelect";
import { maskedField } from "@/components/custom/MaskedField";
import { GenericPendingsPage } from "@/components/pendings/GenericPendingsPage";
import ScheduleSampleForm from "@/components/scheduleSample/ScheduleSampleForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoading } from "@/contexts/LoadingContext";
import useSession from "@/hooks/useSession";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchStringMaps } from "@/store/slices/basicSlice";
import { clearSelectedExamItem, fetchCollectionSchedule, fetchPendings } from "@/store/slices/pendingsSlice";
import { clearSelectedDoctorId, getLinkedDoctor, setSelectedDoctorId } from "@/store/slices/registerPatientSlice";
import { IStringMap } from "@/types";
import { ExamPendingModel, IPatientSampleCollectionViewModel, PatientData } from "@/types/diagnostic";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScheduleSample() {
  const [dadosPaciente, setDadosPaciente] = useState<IPatientSampleCollectionViewModel | null>(null);
  const searchParams = useSearchParams();
  const { role } = useSession();
  const isProfessional = role === "professional";
  const dispatch = useAppDispatch();
  const selectedDoctorId = useAppSelector((state) => state.registerPatient.selectedDoctorId);
  const linkedDoctor = useAppSelector((state) => state.registerPatient.data.linkedDoctor);
  const { data: pendings, loading, collectionScheduleData, selectedExamItem } = useAppSelector((state) => state.pending);
  const [preferredTimeStringMaps, setPreferredTimeStringMaps] = useState<IStringMap[]>([]);
  const { show, hide } = useLoading();

  useEffect(() => {
    if (isProfessional) {
      dispatch(getLinkedDoctor());
    }
  }, [dispatch, isProfessional]);

  useEffect(() => {
    const queryDoctorId = searchParams.get("selectedDoctorId");
    if (queryDoctorId) {
      dispatch(setSelectedDoctorId(queryDoctorId));
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    const examIdParam = searchParams.get("examId");
    if (examIdParam) {
      dispatch(fetchCollectionSchedule(examIdParam));
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (role === "professional") {
      dispatch(fetchPendings(["EXAM_WAITING_SCHEDULE_WITHDRAWAL", selectedDoctorId!]));
    } else {
      dispatch(fetchPendings(["EXAM_WAITING_SCHEDULE_WITHDRAWAL"]));
    }
  }, [dispatch, role, selectedDoctorId]);

  useEffect(() => {
    if (loading) show();
    else hide();
  }, [loading, show, hide]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(clearSelectedExamItem());
      dispatch(clearSelectedDoctorId());
      const preferredTimeStringMapResult = await dispatch(fetchStringMaps({ attributeName: "PreferredTimeStringMap", entityName: "LogisticsSchedule" })).unwrap();
      setPreferredTimeStringMaps(preferredTimeStringMapResult);
    };

    fetchData();
  }, [dispatch]);

  const fixedCategories = ["Solicitações de Retirada de Amostra"];

  const grouped: Record<string, ExamPendingModel[]> = {
    "Solicitações de Retirada de Amostra": pendings.generateBatchDeclarations,
  };

  return (
    <div className="p-6 space-y-6">
      {isProfessional && (
        <CustomFilterSelect
          name="linkedDoctor"
          label="Escolher Médico"
          options={linkedDoctor ?? []}
          value={selectedDoctorId ?? ""}
          onChange={(value) => dispatch(setSelectedDoctorId(value))}
          customClass="w-full md:max-w-md"
        />
      )}
      {(!isProfessional || selectedDoctorId) && (
        <>
          <GenericPendingsPage fixedCategories={fixedCategories} grouped={grouped} />

          <AnimatePresence mode="wait">
            {collectionScheduleData && (
              <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}>
                <ScheduleSampleForm data={collectionScheduleData} item={selectedExamItem!} preferredTimeStringMaps={preferredTimeStringMaps} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}