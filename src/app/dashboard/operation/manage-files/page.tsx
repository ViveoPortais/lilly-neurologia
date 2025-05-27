"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGetAnnotations } from "@/store/slices/manageFileSlice";
import { base64ToBlobUrl, downloadBase64File } from "@/helpers/fileHelper";

import { getAnnotationColumns } from "@/components/manageFiles/columns";
import { DataTable } from "@/components/dashboard/DataTable";
import { Button } from "@/components/ui/button";
import { PdfViewerModal } from "@/components/modals/PdfViewerModal";
import GenericModalForm from "@/components/modals/GenericModalForm";
import AddFileModal from "@/components/manageFiles/AddFileModal";
import { ChangeFileModal } from "@/components/manageFiles/ChangeFileModal";
import { FiUpload } from "react-icons/fi";
import { AnnotationModel } from "@/types/general";
import { fetchStringMaps } from "@/store/slices/basicSlice";
import { AttachmentModel } from "@/types/diagnostic";

export default function ManageFilesPage() {
 const dispatch = useAppDispatch();
 const { annotations, loading } = useAppSelector((state) => state.manageFile);
 const { stringMaps } = useAppSelector((state) => state.basic.data);
 const [files, setFiles] = useState<AnnotationModel[]>([]);

 const [pdfUrl, setPdfUrl] = useState("");
 const [openPdfModal, setOpenPdfModal] = useState(false);
 const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
 const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
 const [selectedRowData, setSelectedRowData] = useState<any | null>(null);

 useEffect(() => {
  const flattened: AnnotationModel[] = [];

  annotations.forEach((annotation: AnnotationModel) => {
   const attachment = annotation.attachments?.[0];
   if (attachment) {
    flattened.push({
     attachments: [attachment],
     id: annotation.id,
     modifiedByName: annotation.modifiedByName,
     modifiedOn: annotation.modifiedOn,
     annotationTypeStringMap: annotation.annotationTypeStringMap,
    });
   }
  });

  flattened.sort((a, b) => {
   const dateA = a.modifiedOn ? new Date(a.modifiedOn).getTime() : 0;
   const dateB = b.modifiedOn ? new Date(b.modifiedOn).getTime() : 0;
   return dateB - dateA;
  });

  setFiles(flattened);
 }, [annotations]);

 useEffect(() => {
  dispatch(fetchGetAnnotations());
  dispatch(fetchStringMaps({ entityName: "Annotation", attributeName: "AnnotationTypeStringMap" }));
 }, [dispatch]);

 const handleVisualizePdf = (file: AnnotationModel) => {
  const url = base64ToBlobUrl(file.attachments[0].documentBody!, file.attachments[0].contentType!);
  setPdfUrl(url);
  setOpenPdfModal(true);
 };

 const handleDownloadFile = (file: AnnotationModel) => {
  downloadBase64File(file.attachments[0].documentBody!, file.attachments[0].fileName!, file.attachments[0].contentType!);
 };

 const handleEdit = (file: any) => {
  setSelectedRowData(file);
  setIsChangeModalOpen(true);
 };

 const columns = getAnnotationColumns({
  onPreview: handleVisualizePdf,
  onDownload: handleDownloadFile,
  onEdit: handleEdit,
 });

 return (
  <>
   <div className="flex justify-between items-center mb-4 md:pr-5 md:pl-5">
    <h1 className="text-2xl font-bold">Alterar Arquivos</h1>
    <Button className="flex items-center gap-2 px-4 py-2" onClick={() => setIsAddFileModalOpen(true)}>
     <FiUpload size={18} />
     Adicionar Arquivo
    </Button>
   </div>

   <DataTable
    data={files}
    columns={columns}
    isLoading={loading}
    hasHeaderNumberOfRows
    contentHeaderNumberOfRows="Total de documentos disponíveis"
   />

   <PdfViewerModal open={openPdfModal} onClose={() => setOpenPdfModal(false)} pdfUrl={pdfUrl} showDownload />

   <GenericModalForm title="Adicionar Arquivo" isOpen={isAddFileModalOpen} onClose={() => setIsAddFileModalOpen(false)}>
    {(onClose) => <AddFileModal onConfirm={() => onClose()} options={stringMaps} />}
   </GenericModalForm>

   <GenericModalForm title="Alterar Documentos" isOpen={isChangeModalOpen} onClose={() => setIsChangeModalOpen(false)}>
    {(onClose) => (
     <ChangeFileModal
      onClose={onClose}
      onConfirm={() => onClose()}
      data={selectedRowData as AnnotationModel}
     />
    )}
   </GenericModalForm>
  </>
 );
}
