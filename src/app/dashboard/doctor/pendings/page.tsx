"use client";
import { CustomFilterSelect } from "@/components/custom/CustomFilterSelect";
import { GenericPendingsPage } from "@/components/pendings/GenericPendingsPage";
import { useLoading } from "@/contexts/LoadingContext";
import useSession from "@/hooks/useSession";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPendings } from "@/store/slices/pendingsSlice";
import { clearSelectedDoctorId, getLinkedDoctor, setSelectedDoctorId } from "@/store/slices/registerPatientSlice";
import { ExamPendingModel } from "@/types/diagnostic";
import { useEffect } from "react";

export default function PendingsDoctorPage() {
  const dispatch = useAppDispatch();
  const { data: pendings, loading, error } = useAppSelector((state) => state.pending);
  const { show, hide } = useLoading();
  const { role } = useSession();
  const linkedDoctor = useAppSelector((state) => state.registerPatient.data.linkedDoctor);
  const selectedDoctorId = useAppSelector((state) => state.registerPatient.selectedDoctorId);

  const isProfessional = role === "professional";

  useEffect(() => {
    if (isProfessional) {
      if (selectedDoctorId) {
        dispatch(fetchPendings([undefined, selectedDoctorId]));
      }
    } else {
      dispatch(fetchPendings());
    }
  }, [dispatch, isProfessional, selectedDoctorId]);

  useEffect(() => {
    if (loading) show();
    else hide();
  }, [loading, show, hide]);

  useEffect(() => {
    if (isProfessional) {
      dispatch(getLinkedDoctor());
    }
  }, [dispatch, isProfessional]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedDoctorId());
    };
  }, [dispatch]);

  const fixedCategories = ["Documentação", "Solicitações de Retirada de Amostra", "Problema com a Amostra", "Aprovação de Vínculo"];

  const grouped: Record<string, ExamPendingModel[]> = {
    Documentação: pendings.documents,
    "Solicitações de Retirada de Amostra": pendings.generateBatchDeclarations,
    "Problema com a Amostra": pendings.problemWithSamples,
    "Aprovação de Vínculo": pendings.pendingAssociations,
  };

  return (
    <>
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

      {(!isProfessional || selectedDoctorId) && <GenericPendingsPage fixedCategories={fixedCategories} grouped={grouped} />}
    </>
  );
}