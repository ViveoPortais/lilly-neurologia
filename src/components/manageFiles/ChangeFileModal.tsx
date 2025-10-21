"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import FileUploader from "@/components/custom/FileUploader";
import { UploadButton } from "../custom/UploadButton";
import { useState } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";
import FileDownload from "../custom/FileDownload";
import { fileToBase64 } from "@/helpers/fileHelper";
import { useLoading } from "@/contexts/LoadingContext";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { AnnotationModel } from "@/types/general";
import { useAppDispatch } from "@/store/hooks";
import { fetchGetAnnotations, fetchUpdateAnnotation } from "@/store/slices/manageFileSlice";
import { Input } from "../ui/input";

interface ChangeFileModalProps {
  onClose: () => void;
  onConfirm: () => void;
  data: AnnotationModel;
}

export const ChangeFileModal = ({ onClose, onConfirm, data }: ChangeFileModalProps) => {
  const [newFileError, setNewFileError] = useState("");
  const [evidenceError, setEvidenceError] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [name, setName] = useState(data.name || "");
  const { show, hide } = useLoading();
  const modal = useGenericModal();
  const dispatch = useAppDispatch();
  const annotationTypeStringMapId = data.annotationTypeStringMapId ?? data.annotationTypeStringMap?.id;
  if (!annotationTypeStringMapId) {
    modal.showModal({
      type: "warning",
      message: "Tipo do documento (AnnotationTypeStringMapId) não encontrado.",
    });
    hide();
    return;
  }

  const handleConfirm = async () => {
    if (!newFile || !evidenceFile || !name) return;

    try {
      show();
      const [newFileBase64, evidenceBase64] = await Promise.all([fileToBase64(newFile), fileToBase64(evidenceFile)]);

      const payload: AnnotationModel = {
        id: data.id,
        annotationTypeStringMapId,
        name: name,
        attachments: [
          {
            fileName: newFile.name,
            contentType: newFile.type,
            fileSize: newFile.size.toString(),
            documentBody: newFileBase64 as string,
          },
          {
            fileName: evidenceFile.name,
            contentType: evidenceFile.type,
            fileSize: evidenceFile.size.toString(),
            documentBody: evidenceBase64 as string,
            flag: "#EVIDENCE",
          },
        ],
      };

      const response = await dispatch(fetchUpdateAnnotation(payload)).unwrap();
      if (response.isValidData) {
        modal.showModal(
          {
            type: "success",
            message: response.additionalMessage,
          },
          () => {
            dispatch(fetchGetAnnotations());
            onConfirm();
          }
        );
      } else {
        modal.showModal({
          type: "warning",
          message: response.additionalMessage || "Ocorreu um problema ao adicionar o arquivo.",
        });
      }
      onConfirm();
    } catch (err) {
      modal.showModal({
        type: "error",
        title: "Erro",
        message: "Erro ao alterar arquivos.",
      });
    } finally {
      hide();
    }
  };

  return (
    <div className="space-y-4">
      <Input 
        id="name" 
        placeholder="Descrição do arquivo" 
        value={name} 
        onChange={(e) => setName(e.target.value)}
      />
      <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-2 bg-gray-50 md:grid md:grid-cols-[160px_1fr] md:items-center gap-2">
        <p className="text-lg text-zinc-800">Arquivo a ser substituído</p>
        <FileDownload
          annotationType={data.attachments[0].fileName ?? ''}
          attachment={{
            fileName: data.attachments[0].fileName!,
            fileSize: data.attachments[0].fileSize!,
            documentBody: data.attachments[0].documentBody || "",
            contentType: data.attachments[0].contentType || "application/pdf",
            fileType: data.attachments[0].fileType || "pdf",
          }}
        />
      </div>

      <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-2 bg-gray-50 md:grid md:grid-cols-[160px_1fr] md:items-center gap-2">
        <p className="text-lg text-zinc-800">Upload do novo arquivo</p>
        <UploadButton
          fieldName="newFile"
          label="Upload do Novo Termo"
          onFileValid={(file) => {
            setNewFile(file);
            setNewFileError("");
          }}
          onError={(message) => {
            setNewFile(null);
            setNewFileError(message);
          }}
          errorMessage={newFileError}
        />
      </div>

      <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-2 bg-gray-50 md:grid md:grid-cols-[160px_1fr] md:items-center gap-2">
        <p className="text-lg text-zinc-800">Upload da evidência</p>
        <UploadButton
          fieldName="evidenceFile"
          label="Upload de Evidência de Aprovação"
          onFileValid={(file) => {
            setEvidenceFile(file);
            setEvidenceError("");
          }}
          onError={(message) => {
            setEvidenceFile(null);
            setEvidenceError(message);
          }}
          errorMessage={evidenceError}
        />
      </div>

      <p className="text-xs text-red-600 flex items-center justify-center gap-1 mt-2">
        <IoAlertCircleOutline size={20} className="min-w-[14px]" />
        Insira apenas arquivos com tamanho máximo de 5MB / Permitido apenas arquivos PDF, JPG ou PNG
      </p>

      <div className="w-full flex justify-center gap-2 pt-4">
        <Button variant="outlineMainlilly" onClick={onClose} className="w-1/2">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} className="w-1/2" disabled={!newFile || !evidenceFile}>
          Salvar
        </Button>
      </div>
    </div>
  );
};