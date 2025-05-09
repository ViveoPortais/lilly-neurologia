import { DiagnosticData } from "@/types";
import api from "./api";
import { ExamCreateModel } from "@/types/diagnostic";

const programCode = `${process.env.PROGRAM_CODE}`;

export const exams = async () => {
 const response = await api.get("/ExamDefinition/getexamdefinitionbyprogram", {
  params: {
   programcode: programCode,
  },
 });
 return response.data;
};

export const diseases = async () => {
 const response = await api.get("/Disease/getdiseases", {
  params: {
   programcode: programCode,
  },
 });
 return response.data;
};

export const labs = async () => {
 const response = await api.get("/AccountSettingsByProgram/getaccounts", {
  params: {
   programcode: programCode,
  },
 });
 return response.data;
};

export const gender = async () => {
 const response = await api.get("/StringMap/getstringmaplist", {
  params: {
   entityName: "Diagnostic",
   attributeName: "GenderStringMap",
   programcode: programCode,
  },
 });
 return response.data;
};

export const registerPatient = async (data: ExamCreateModel) => {
 const response = await api.post("/Diagnostic/add", {
  ...data
 });
 return response.data;
};

export const searchPatient = async (cpf: string) => {
 const response = await api.get("/Diagnostic/by-cpf", {
  params: {
   cpf,
   programCode,
  },
 });
 return response.data;
};

export const getDoctor = async () => {
 const response = await api.get("/Doctor/getdoctorinfo", {
  params: {
   programCode,
  },
 });
 return response.data;
};
