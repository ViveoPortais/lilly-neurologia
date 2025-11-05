"use client";

import { useEffect, useState } from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { FiCheck, FiDownload } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { ExamPendingModel, IDocumentFilledRequestModel, IPrintDocumentsModel } from "@/types/diagnostic";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPendencyReasons } from "@/store/slices/pendingsSlice";
import { downloadBase64File, fileToBase64 } from "@/helpers/fileHelper";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import { UploadButton } from "@/components/custom/UploadButton";
import { AlertCircle, Download } from "lucide-react";
import { fetchTermAttachFilled } from "@/store/slices/diagnosticSlice";
import { toast } from "react-toastify";
import { useLoading } from "@/contexts/LoadingContext";
import { FaCircleExclamation } from "react-icons/fa6";

interface PrintDocumentsModalProps {
  onClose: () => void;
  item: IPrintDocumentsModel;
}

export default function OperationRejectedDocModal({ onClose, item }: PrintDocumentsModalProps) {
  const dispatch = useAppDispatch();
  const { resolve } = useResolveExamPendency();
  const { show, hide } = useLoading();

  const [logisticsBatchDownloaded, setLogisticsBatchDownloaded] = useState<boolean>(false);
  const [transportDeclarationDownloaded, setTransportDeclarationDownloaded] = useState<boolean>(false);


  const doc = item.attachments?.[0];

  useEffect(() => {
    dispatch(fetchPendencyReasons());
  }, [dispatch]);

  const handleSave = async () => {
    try {
      await resolve({
        item: {
          ...item,
        },
        onSuccess: onClose,
      });

    }
    catch (error) {
      toast.error('Falha ao resolver pendência');
    }

  };

  const handleDownloadLogisticsBatch = () => {
    try {
      const attachment = item.attachments[0];

      if (attachment)
        downloadBase64File(attachment.documentBody!, attachment.fileName!, attachment.contentType!);

      setTimeout(() => {
        setLogisticsBatchDownloaded(true);
      }, 300);

    } catch (error) {
      setLogisticsBatchDownloaded(false);
    }
  };

  const handleDownloadTransportDeclaration = async () => {
    try {
      show();
      const payload: IDocumentFilledRequestModel = {
        examId: item.id,
        annotationTypeStringMapFlag: "#TRANSPORT_DECLARATION"
      }

      const res = await dispatch(fetchTermAttachFilled({ data: payload })).unwrap();
      if (res) {
        const url = window.URL.createObjectURL(new Blob([res], { type: "application/pdf" }));
        const a = document.createElement("a");

        a.href = url;
        a.download = `Declaração de Transporte e Ficha de Emergencia ${item.patientName}`;
        document.body.appendChild(a);
        a.click();
      }

      setTimeout(() => {
        setTransportDeclarationDownloaded(true);
        hide();
      }, 300);

    } catch (error) {
      setTransportDeclarationDownloaded(false);
    } finally {
      hide();
    }
  };


  return (
    <div className="space-y-4 p-6">
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          handleDownloadLogisticsBatch();
        }}
        className="w-[100%] h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
      >
        {logisticsBatchDownloaded ? (
          <FiCheck size={20} color="green" className="w-4 h-4 mr-2" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )
        }
        Declaração de Lote Logístico
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={() => {
          handleDownloadTransportDeclaration();
        }}
        className="w-[100%] h-10 bg-gray-200 text-gray-700 text-sm font-normal hover:bg-gray-300"
      >
        {transportDeclarationDownloaded ? (
          <FiCheck size={20} color="green" className="w-4 h-4 mr-2" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )
        }
        Declaração de Transporte e Ficha de Emergência
      </Button>


      <div className="justify-start space-x-2 p-6">
        <div className="flex flex-row gap-2">
          <FaCircleExclamation size={15} className="text-red-200 bg-mainlilly rounded rounded-full mt-[0.25em]" />
          <h4 className="font-semibold text-gray-700 mb-2">Atenção:</h4>
        </div>
        <div className="flex flex-row">
          <ul className="text-sm text-gray-700 space-y-1">
            <li className="flex items-start space-x-1">
              <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
              <span>Imprimir 2 vias da <span className="italic">Declaração de Transporte Nacional</span> em papel timbrado;</span>
            </li>
            <li className="flex items-start space-x-1">
              <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
              <span>É obrigatório preencher o tipo de material e a quantidade (em mL);</span>
            </li>
            <li className="flex items-start space-x-1">
              <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
              <span>Assinar, datar e carimbar com o registro profissional (CRM / CRF / COREN / CRBM) do responsável;</span>
            </li>
            <li className="flex items-start space-x-1">
              <span className="w-1 h-1 bg-black rounded-full mt-2 flex-shrink-0"></span>
              <span className="font-bold">Sem a documentação corretamente preenchida e assinada, o transporte do material não poderá ser realizado</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2">
        <Button type="button" className="w-full" onClick={handleSave} disabled={!logisticsBatchDownloaded || !transportDeclarationDownloaded}>
          Resolver pendência
        </Button>
      </div>
    </div>
  );
}
