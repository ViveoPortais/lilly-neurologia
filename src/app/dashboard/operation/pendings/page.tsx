"use client";
import { GenericPendingsPage } from "@/components/pendings/GenericPendingsPage";
import { useLoading } from "@/contexts/LoadingContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPendings } from "@/store/slices/pendingsSlice";
import { ExamPendingModel } from "@/types/diagnostic";
import { useEffect } from "react";

export default function PendingsOperationPage() {
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

 const fixedCategories = ["Documentação", "Gerar Declaração de Lote", "Confirmar Entrega de Amostra", "Concluir Análise"];

 const grouped: Record<string, ExamPendingModel[]> = {
  Documentação: pendings.documents,
  "Gerar Declaração de Lote": pendings.batchPendingDeclarations,
  "Confirmar Entrega de Amostra": [],
  "Concluir Análise": [],
 };

 return <GenericPendingsPage fixedCategories={fixedCategories} grouped={grouped} />;
}