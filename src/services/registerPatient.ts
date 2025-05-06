import api from "./api";

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

export const registerPatient = async (data: any) => {
 const response = await api.post("/Diagnostic/add", {
  ...data,
  programCode,
 });
 return response.data;
};
