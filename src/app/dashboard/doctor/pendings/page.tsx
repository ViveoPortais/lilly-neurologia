"use client";
import { GenericPendingsPage } from "@/components/pendings/GenericPendingsPage";
import { useLoading } from "@/contexts/LoadingContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPendings } from "@/store/slices/pendingsSlice";
import { ExamPendingModel } from "@/types/diagnostic";
import { useEffect } from "react";

export default function PendingsDoctorPage() {
    const dispatch = useAppDispatch();
    const { data: pendings, loading, error } = useAppSelector((state) => state.pending);
    const { show, hide } = useLoading();

    useEffect(() => {
        dispatch(fetchPendings());
    }, [dispatch]);

 useEffect(() => {
  if (loading) show();
  else hide();
 }, [loading, show, hide]);

    const fixedCategories = ["Documentação", "Solicitações de Retirada de Amostra", "Problema com a Amostra", "Aprovação de Vínculo"];

    const grouped: Record<string, ExamPendingModel[]> = {
        Documentação: pendings.documents,
        "Recebimento do tubo": pendings.tubes,
        "Solicitações de Retirada de Amostra": [],
        "Problema com a Amostra": [],
        "Aprovação de Vínculo": [],
    };

 return <GenericPendingsPage fixedCategories={fixedCategories} grouped={grouped} />;
}
