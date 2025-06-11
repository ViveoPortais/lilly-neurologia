"use client";

import { useEffect, useState } from "react";
import { AiFillFilePdf } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/custom/CustomSelect";
import { ExamPendingModel } from "@/types/diagnostic";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPendencyReasons } from "@/store/slices/pendingsSlice";
import { downloadBase64File, fileToBase64 } from "@/helpers/fileHelper";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import { UploadButton } from "@/components/custom/UploadButton";

interface OperationRejectedDocModalProps {
 onClose: () => void;
 item: ExamPendingModel;
}

export default function OperationRejectedDocModal({ onClose, item }: OperationRejectedDocModalProps) {
 const dispatch = useAppDispatch();
 const { resolve } = useResolveExamPendency();
 const pendencyReasons = useAppSelector((state) => state.pending.reasons);

 const [isTermApproved, setIsTermApproved] = useState<boolean | null>(null);
 const [isMedicApproved, setIsMedicApproved] = useState<boolean | null>(null);
 const [rejectionReasonMap, setRejectionReasonMap] = useState<Record<string, string>>({});
 const [uploadedFile, setUploadedFile] = useState<File | null>(null);
 const [attachmentBase64, setAttachmentBase64] = useState<string | null>(null);

 useEffect(() => {
  dispatch(fetchPendencyReasons());
 }, [dispatch]);

 const handleDecision = (docType: "termo" | "pedido", decision: "approved" | "rejected") => {
  if (docType === "termo") {
   setIsTermApproved(decision === "approved");
  } else {
   setIsMedicApproved(decision === "approved");
  }
 };

 const handleSave = async () => {
  const logistAttachments =
   uploadedFile && attachmentBase64
    ? {
       fileName: uploadedFile.name,
       contentType: uploadedFile.type,
       documentBody: attachmentBase64,
       fileSize: uploadedFile.size.toString(),
       fileType: uploadedFile.type,
       flag: "#ETIQUETA",
      }
    : undefined;

  const updatedAttachments = item.attachments?.map((attachment) => {
   const docName = attachment.annotationTypeName ?? "";

   const isTerm = docName.toLowerCase().includes("termo");
   const isPedido = docName.toLowerCase().includes("pedido");

   const isApproved = isTerm ? isTermApproved : isPedido ? isMedicApproved : null;

   const rejectionReasonId = rejectionReasonMap[docName];
   const matchedReason = pendencyReasons.find((r) => r.id === rejectionReasonId);
   const rejectionReasonName = matchedReason?.name;

   return {
    ...attachment,
    isApproved,
    pendencyDescription: rejectionReasonName,
   };
  });

  const itemWithLogist = {
   ...item,
   logistAttachments,
   attachments: updatedAttachments,
  };

  await resolve({
   item: itemWithLogist,
   onSuccess: onClose,
  });
 };

 const hasAnyDecision = isTermApproved !== null || isMedicApproved !== null;
 const hasUpload = !!attachmentBase64;

 const termNeedsReason = isTermApproved === false && !!rejectionReasonMap["Termo de Consentimento"];
 const medicNeedsReason = isMedicApproved === false && !!rejectionReasonMap["Pedido do Médico"];

 const isTermValid =
  (isTermApproved === true && hasUpload) || (isTermApproved === false && termNeedsReason && hasUpload) || isTermApproved === null;

 const isMedicValid =
  (isMedicApproved === true && hasUpload) || (isMedicApproved === false && medicNeedsReason && hasUpload) || isMedicApproved === null;

 const canSave = hasAnyDecision && isTermValid && isMedicValid;

 return (
  <div className="space-y-4">
   <div className="space-y-2 border border-dashed border-zinc-300 rounded-lg p-4 bg-[#f9f9f9]">
    {item.attachments?.map((doc) => {
     const isTerm = doc.annotationTypeName?.toLowerCase().includes("termo");
     const isPedido = doc.annotationTypeName?.toLowerCase().includes("pedido");
     const status = isTerm ? isTermApproved : isMedicApproved;

     const rejectionOptions = pendencyReasons
      .filter((reason) => (isTerm ? reason.flag === "#TERM_CONSENT" : isPedido ? reason.flag === "#MEDICAL_ORDER" : true))
      .map((reasons) => ({
       id: reasons.id,
       value: reasons.name,
      }));

     return (
      <div
       key={doc.fileName}
       className="flex flex-col sm:flex-row justify-between items-start sm:items-center border border-zinc-300 rounded-lg px-4 py-3 bg-white gap-2"
      >
       <div className="flex items-start gap-2 relative w-full sm:w-auto">
        <AiFillFilePdf className="text-red-600 mt-1 shrink-0" size={20} />
        <div className="flex flex-col max-w-full sm:max-w-[160px]">
         <span className="text-sm font-medium text-zinc-800 truncate">{doc.annotationTypeName}</span>
         <span className="text-xs text-zinc-500 text-left">{doc.fileSize ? `${doc.fileSize} KB` : "Tamanho indefinido"}</span>
        </div>
        <FiDownload
         className="text-zinc-500 absolute right-0 top-1 sm:static sm:ml-2 cursor-pointer"
         size={16}
         onClick={() => {
          if (doc.documentBody) {
           downloadBase64File(doc.documentBody, doc.fileName || "documento.pdf", doc.contentType || "application/pdf");
          }
         }}
        />
       </div>

       <div className="flex flex-col sm:flex-row w-full sm:w-auto justify-between sm:justify-end gap-2">
        {status === true ? (
         <span className="flex items-center gap-1 text-green-600 font-semibold border border-green-500 px-3 py-1 rounded-md text-sm w-full sm:w-[100px] justify-center">
          <FaCheckCircle size={14} /> Aprovado
         </span>
        ) : status === false ? (
         <div className="w-full sm:w-[240px]">
          <CustomSelect
           name={`reason-${doc.annotationTypeName}`}
           label="Motivo"
           value={rejectionReasonMap[doc.annotationTypeName ?? ""]}
           onChange={(value) =>
            setRejectionReasonMap((prev) => ({
             ...prev,
             [doc.annotationTypeName ?? ""]: value,
            }))
           }
           options={rejectionOptions}
          />
         </div>
        ) : (
         <>
          <button
           className="flex items-center gap-1 text-sm px-3 py-1 rounded-md border font-semibold transition w-full sm:w-[100px] justify-center border-green-500 text-green-600 hover:bg-green-50"
           onClick={() => handleDecision(isTerm ? "termo" : "pedido", "approved")}
          >
           <FaCheckCircle size={14} /> Aprovar
          </button>
          <button
           className="flex items-center gap-1 text-sm px-3 py-1 rounded-md border font-semibold transition w-full sm:w-[100px] justify-center border-red-500 text-red-600 hover:bg-red-50"
           onClick={() => handleDecision(isTerm ? "termo" : "pedido", "rejected")}
          >
           <FaTimesCircle size={14} /> Reprovar
          </button>
         </>
        )}
       </div>
      </div>
     );
    })}
   </div>

   <UploadButton
    fieldName="logistLabel"
    label="Upload de Etiqueta para Logística"
    onFileValid={async (file: File) => {
     const base64 = await fileToBase64(file);
     setUploadedFile(file);
     setAttachmentBase64(base64);
    }}
    onError={() => {
     setUploadedFile(null);
     setAttachmentBase64(null);
    }}
   />

   <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2">
    <Button type="button" variant="outlineMainlilly" className="w-full sm:w-1/2" onClick={onClose}>
     Cancelar
    </Button>
    <Button type="button" className="w-full sm:w-1/2" onClick={handleSave} disabled={!canSave}>
     Salvar
    </Button>
   </div>
  </div>
 );
}