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

 if (loading) show();
 else hide();

 const fakePendings: ExamPendingModel[] = [
  {
   id: "1",
   diagnosticId: "d1",
   numberProtocol: "12345-XYZ",
   voucher: "VOUCHER-001",
   patientName: "Ana Beatriz Ramos",
   doctorName: "Dr. Ricardo Souza",
   reason: "Documentação reprovada",
   dateCreate: "2024-05-01T14:30:00",
   dateUpdate: "2024-05-05T09:15:00",
   attachments: [
    {
     fileName: "termo_consentimento.pdf",
     fileSize: "102400",
     contentType: "application/pdf",
     documentBody: "",
     fileType: "PDF",
     annotationTypeName: "Termo de Consentimento",
     pendencyDescription: "Documento obrigatório ausente",
     annotationTypeStringMapCode: null,
     annotationTypeStringMapId: null,
     healthProgramCode: null,
     name: "Termo Consentimento",
    },
   ],
  },
  {
   id: "2",
   diagnosticId: "d2",
   numberProtocol: "98765-ABC",
   voucher: "VOUCHER-002",
   patientName: "Carlos Henrique Lima",
   doctorName: "Dra. Mariana Costa",
   reason: "Documentação reprovada",
   dateCreate: "2024-05-02T10:00:00",
   dateUpdate: "2024-05-06T11:45:00",
   attachments: [
    {
     fileName: "pedido_medico.jpeg",
     fileSize: "204800",
     contentType: "image/jpeg",
     documentBody: "",
     fileType: "JPEG",
     annotationTypeName: "Pedido Médico",
     pendencyDescription: "Arquivo ilegível",
     annotationTypeStringMapCode: null,
     annotationTypeStringMapId: null,
     healthProgramCode: null,
     name: "Pedido Médico",
    },
   ],
  },
 ];

 const fixedCategories = ["Documentação", "Gerar Declaração de Lote", "Confirmar Entrega de Amostra", "Concluir Análise"];

 const grouped: Record<string, ExamPendingModel[]> = {
  Documentação: fakePendings,
  "Gerar Declaração de Lote": [],
  "Confirmar Entrega de Amostra": [],
  "Concluir Análise": [],
 };

 return <GenericPendingsPage pendings={fakePendings} fixedCategories={fixedCategories} grouped={grouped} />;
}
