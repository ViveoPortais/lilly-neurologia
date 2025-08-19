import { AnnotationModel, IAnnotationFilterModel,IAttachmentModel } from "@/types/general";
import api from "./api";
import { ExamCreateModel, IDocumentFilledRequestModel } from "@/types/diagnostic";

const programCode = `${process.env.NEXT_PUBLIC_PROGRAM_CODE}`;

export const addAnnotation = async (data: AnnotationModel) => {
 const res = await api.post("/Annotation/Add", {
  ...data,
  programCode: programCode,
 });

 return res.data;
};

export const getAnnotationsFile = async (filter: IAnnotationFilterModel) => {
 const response = await api.get("/Annotation/getAnnotations", {
  params: {
   ...filter,
   programCode: programCode,
  },
 });

 return response.data;
};

export const updateAnnotation = async (data: AnnotationModel) => {
 const response = await api.put("/Annotation/Update", {
  ...data,
  programCode: programCode,
 });

 return response.data;
};

export const downloadDocumentFilled = async (data: IDocumentFilledRequestModel) => {
    const response = await api.post(
        "/Annotation/documentFilled",
        {
            ...data,
            programcode: programCode,
        },
        {
            responseType: "blob",
        }
    );
    return response.data;
};

export const getLatestRegistrationConsent = async () => {
  const res = await api.get<IAttachmentModel>("/Annotation/consent/registration/latest-attachment", {
    params: { programCode: process.env.NEXT_PUBLIC_PROGRAM_CODE },
  });
  return res.data;
};