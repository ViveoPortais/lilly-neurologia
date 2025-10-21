"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchGetAnnotations, submitDeleteAnnotation } from "@/store/slices/manageFileSlice";
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
import { useGenericModal } from "@/contexts/GenericModalContext";
import { ConfirmationDialog } from "@/components/custom/ConfirmationDialog";
import { showNotificationToast } from "@/components/custom/ToastNotification";
import { useLoading } from "@/contexts/LoadingContext";

export default function ManageFilesPage() {
    const dispatch = useAppDispatch();
    const { annotations, loading } = useAppSelector((state) => state.manageFile);
    const { stringMaps } = useAppSelector((state) => state.basic.data);
    const [files, setFiles] = useState<AnnotationModel[]>([]);
    const modal = useGenericModal();

    const [pdfUrl, setPdfUrl] = useState("");
    const [openPdfModal, setOpenPdfModal] = useState(false);
    const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
    const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState<any | null>(null);
    const [isDeleteConfirmationModal, setIsDeleteConfirmationModal] = useState(false);

    const { show, hide } = useLoading();
    
    useEffect(() => {
        const flattened: AnnotationModel[] = [];

        annotations.forEach((annotation: AnnotationModel, index) => {
            const attachment = annotation.attachments?.[0];
            if (attachment) {
                flattened.push({
                    attachments: [attachment],
                    id: annotation.id || `annotation-${index}`,
                    name: annotation.name,
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

        // Garantir IDs únicos após ordenação
        const uniqueFiles = flattened.map((file, index) => ({
            ...file,
            id: file.id || `unique-${index}`
        }));

        setFiles(uniqueFiles);
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

    const handleDelete = (file: AnnotationModel) => {
        setSelectedRowData(file);
        setIsDeleteConfirmationModal(true);
    }

    const handleConfirmDelete = async (file: AnnotationModel) => {
        show();
        try {

            setIsDeleteConfirmationModal(false);
            var response = await dispatch(submitDeleteAnnotation(file)).unwrap();

            if (response.isValidData) {

                modal.showModal({
                    type: "success",
                    message: response.additionalMessage
                },
                    () => { dispatch(fetchGetAnnotations()); });

            } else {
                modal.showModal({
                    type: "warning",
                    message: response.additionalMessage || "Ocorreu um problema ao adicionar o arquivo."
                });
            }
        } catch (error) {

            modal.showModal({
                type: "error",
                message: "Ocorreu um erro ao excluir o arquivo."
            });

        } finally {
            hide();
        }
    }

    const columns = getAnnotationColumns({
        onPreview: handleVisualizePdf,
        onDownload: handleDownloadFile,
        onEdit: handleEdit,
        onDelete : handleDelete
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

            <ConfirmationDialog
            open={isDeleteConfirmationModal}
            onClose={() => setIsDeleteConfirmationModal(false)}
            onConfirm={() => handleConfirmDelete(selectedRowData)}
            content={`Tem certeza que deseja excluir o arquivo :  ${selectedRowData === null ? '' : selectedRowData.name} ?`}
            />
        </>
    );
}
