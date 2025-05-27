import { AnnotationModel, IAnnotationFilterModel } from "@/types/general";
import api from "./api";

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