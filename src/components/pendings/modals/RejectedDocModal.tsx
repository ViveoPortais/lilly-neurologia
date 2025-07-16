"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { fileToBase64 } from "@/helpers/fileHelper";
import { ExamPendingModel } from "@/types/diagnostic";
import FileDownload from "@/components/custom/FileDownload";
import { useLoading } from "@/contexts/LoadingContext";
import { useResolveExamPendency } from "@/hooks/useExamResolvePendency";
import { UploadButton } from "@/components/custom/UploadButton";

interface RejectedDocModalProps {
  open: boolean;
  onClose: () => void;
  item: ExamPendingModel;
}

export default function RejectedDocModal({ open, onClose, item }: RejectedDocModalProps) {
  const [uploads, setUploads] = useState<Record<string, { file: File; base64: string }>>({});
  const { show } = useLoading();
  const { resolve } = useResolveExamPendency();

  const doc = item.attachments?.[0];
  if (!open || !doc) return null;

  const docId = doc.annotationTypeStringMapId!;

  const handleFileUpload = async (file: File) => {
    const base64 = await fileToBase64(file);
    setUploads((prev) => ({ ...prev, [docId]: { file, base64 } }));
  };

  const handleConfirm = async () => {
    const uploaded = uploads[docId];
    if (!uploaded) return;

    const updatedModel = {
      ...item,
      attachments: [
        {
          fileName: uploaded.file.name,
          contentType: uploaded.file.type,
          documentBody: uploaded.base64,
          fileSize: uploaded.file.size.toString(),
          fileType: uploaded.file.type,
          annotationTypeName: doc.annotationTypeName,
          annotationTypeStringMapId: docId,
        },
      ],
    };

    show();
    resolve({ item: updatedModel, onSuccess: onClose });
  };

  const hasUploaded = !!uploads[docId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-white rounded-xl p-6 shadow-lg max-w-md w-full max-h-screen overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-zinc-800">Documentação reprovada</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700" aria-label="Fechar modal">
            <X size={20} />
          </button>
        </div>
        <hr className="mb-4 border-zinc-200" />

        <div className="mb-6">
          <p className="text-sm font-semibold text-zinc-800 mb-2">{doc.annotationTypeName}</p>

          <FileDownload
            annotationType={doc.annotationTypeName!}
            attachment={{
              fileName: doc.fileName ?? "",
              contentType: doc.contentType ?? "",
              documentBody: doc.documentBody ?? "",
              fileSize: doc.fileSize ?? "",
              fileType: doc.fileType ?? "",
            }}
          />

          <div className="border border-zinc-300 bg-[#efe9e9] mt-4 text-left p-3 rounded-md">
            <label className="text-sm font-semibold text-zinc-800 mb-1 block">Motivo</label>
            <div className="text-sm text-zinc-700">{doc.pendencyDescription}</div>
          </div>

          <div className="mt-4">
            <UploadButton
              fieldName={`upload-${docId}`}
              label={"Upload novo documento"}
              onFileValid={(file) => handleFileUpload(file)}
              onError={() => {
                setUploads((prev) => {
                  const updated = { ...prev };
                  delete updated[docId];
                  return updated;
                });
              }}
            />
          </div>
        </div>

        <div className="flex py-2 justify-center gap-2">
          <Button type="button" disabled={!hasUploaded} onClick={handleConfirm}>
            Confirmar
          </Button>
        </div>
      </motion.div>
    </div>
  );
}