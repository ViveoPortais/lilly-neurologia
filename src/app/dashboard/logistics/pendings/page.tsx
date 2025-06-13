"use client";
import { GenericPendingsPage } from "@/components/pendings/GenericPendingsPage";
import { useLoading } from "@/contexts/LoadingContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPendings } from "@/store/slices/pendingsSlice";
import { ExamPendingModel } from "@/types/diagnostic";
import { useEffect } from "react";

export default function PendingsLogisticPage() {
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

 const fixedCategories = ["Solicitações de Envio de Tubo", "Confirmar Entrega de Tubo", "Solicitações de Retirada", "Confirmar Retirada da Amostra"];

 const grouped: Record<string, ExamPendingModel[]> = {
  "Solicitações de Envio de Tubo": pendings.labels,
  "Confirmar Entrega de Tubo": pendings.tubes,
  "Solicitações de Retirada": pendings.pickupRequest,
  "Confirmar Retirada da Amostra": pendings.confirmPickupRequests,
 };

 return <GenericPendingsPage fixedCategories={fixedCategories} grouped={grouped} />;
}