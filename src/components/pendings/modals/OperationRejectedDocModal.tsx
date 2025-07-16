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

  const [approved, setApproved] = useState<boolean | null>(null);
  const [rejectionReasonId, setRejectionReasonId] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [attachmentBase64, setAttachmentBase64] = useState<string | null>(null);

  const doc = item.attachments?.[0];

  useEffect(() => {
    dispatch(fetchPendencyReasons());
  }, [dispatch]);

  const handleSave = async () => {
    const matchedReason = pendencyReasons.find((r) => r.id === rejectionReasonId);
    const rejectionReasonName = matchedReason?.name;

    const updatedAttachment = {
      ...doc,
      isApproved: approved,
      pendencyDescription: rejectionReasonName,
    };

    const logistAttachments =
      approved && uploadedFile && attachmentBase64
        ? {
            fileName: uploadedFile.name,
            contentType: uploadedFile.type,
            documentBody: attachmentBase64,
            fileSize: uploadedFile.size.toString(),
            fileType: uploadedFile.type,
            flag: "#ETIQUETA",
          }
        : undefined;

    const updatedItem = {
      ...item,
      attachments: [updatedAttachment],
      logistAttachments,
    };

    await resolve({
      item: updatedItem,
      onSuccess: onClose,
    });
  };

  const isRejected = approved === false;
  const isApproved = approved === true;
  const canSave = (isApproved && attachmentBase64) || (isRejected && !!rejectionReasonId);

  const rejectionOptions = pendencyReasons
    .filter((reason) => reason.flag === "#TERM_CONSENT_AND_MEDICAL_ORDER")
    .map((r) => ({ id: r.id, value: r.name }));

  return (
    <div className="space-y-4">
      {doc && (
        <div className="space-y-2 border border-dashed border-zinc-300 rounded-lg p-4 bg-[#f9f9f9]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border border-zinc-300 rounded-lg px-4 py-3 bg-white gap-2">
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
              {isApproved ? (
                <span className="flex items-center gap-1 text-green-600 font-semibold border border-green-500 px-3 py-1 rounded-md text-sm w-full sm:w-[100px] justify-center">
                  <FaCheckCircle size={14} /> Aprovado
                </span>
              ) : isRejected ? (
                <div className="w-full sm:w-[240px]">
                  <CustomSelect name="rejectionReason" label="Motivo" value={rejectionReasonId} onChange={setRejectionReasonId} options={rejectionOptions} />
                </div>
              ) : (
                <>
                  <button
                    className="flex items-center gap-1 text-sm px-3 py-1 rounded-md border font-semibold transition w-full sm:w-[100px] justify-center border-green-500 text-green-600 hover:bg-green-50"
                    onClick={() => setApproved(true)}
                  >
                    <FaCheckCircle size={14} /> Aprovar
                  </button>
                  <button
                    className="flex items-center gap-1 text-sm px-3 py-1 rounded-md border font-semibold transition w-full sm:w-[100px] justify-center border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => setApproved(false)}
                  >
                    <FaTimesCircle size={14} /> Reprovar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isApproved && (
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
      )}

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