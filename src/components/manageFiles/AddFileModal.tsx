import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiUpload } from "react-icons/fi";
import { useState } from "react";
import { UploadButton } from "../custom/UploadButton";
import { fileToBase64 } from "@/helpers/fileHelper";
import { AnnotationModel } from "@/types/general";
import { useAppDispatch } from "@/store/hooks";
import { fetchGetAnnotations, submitAnnotation } from "@/store/slices/manageFileSlice";
import { useLoading } from "@/contexts/LoadingContext";
import { useGenericModal } from "@/contexts/GenericModalContext";
import { IOption, IStringMap } from "@/types";
import { CustomSelect } from "../custom/CustomSelect";
import { CustomFilterSelect } from "../custom/CustomFilterSelect";

interface AddFileModalProps {
 onConfirm: () => void;
 options: IStringMap[];
}

export default function AddFileModal({ onConfirm, options }: AddFileModalProps) {
 const { register, handleSubmit, watch, setValue } = useForm();
 const [selectedFile, setSelectedFile] = useState<File | null>(null);
 const [uploadError, setUploadError] = useState<string | undefined>(undefined);
 const dispatch = useAppDispatch();
 const fileName = watch("fileName");
 const { show, hide } = useLoading();
 const modal = useGenericModal();

 const onSubmit = async (data: any) => {
  show();
  if (!selectedFile) return;
  try {
   const base64 = await fileToBase64(selectedFile);
   const annotation: AnnotationModel = {
    attachments: [
     {
      fileName: selectedFile.name,
      contentType: selectedFile.type,
      fileSize: selectedFile.size.toString(),
      fileType: selectedFile.type,
      documentBody: base64 as string,
     },
    ],
    name: selectedFile.name,
    annotationTypeStringMapId: data.annotationTypeStringMapId,
   };

   const response = await dispatch(submitAnnotation(annotation)).unwrap();
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
  } catch (error: any) {
   modal.showModal({
    type: "error",
    title: "Erro",
    message: error?.message || "Erro inesperado ao adicionar o arquivo.",
   });
  } finally {
   hide();
  }
 };

 return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:pl-12 md:pr-12">
   {/* <div className="flex flex-row items-center gap-2">

    <Input id="fileName" placeholder="Nome do Arquivo" inputPlaceholder="Digite o nome..." {...register("fileName", { required: true })} />
   </div> */}

   <CustomFilterSelect
    name="annotationTypeStringMapId"
    options={options}
    label="Tipo do arquivo"
    value={watch("annotationTypeStringMapId")}
    onChange={(val) => setValue("annotationTypeStringMapId", val)}
    customClass="text-left"
   />

   <UploadButton
    fieldName="file"
    label="Selecionar Arquivo"
    onFileValid={(file) => {
     setSelectedFile(file);
     setUploadError(undefined);
    }}
    onError={(message) => {
     setSelectedFile(null);
     setUploadError(message);
    }}
    errorMessage={uploadError}
   />

   <div className="w-full flex items-center justify-center">
    <Button disabled={!selectedFile} type="submit">
     Adicionar Arquivo
    </Button>
   </div>
  </form>
 );
}
