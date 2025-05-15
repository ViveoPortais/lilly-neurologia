import { ResolveExamPendency } from "@/types/diagnostic";
import { api } from "./api";
const programCodeEnv = `${process.env.NEXT_PUBLIC_PROGRAM_CODE}`;

export const getListOptions = async (programCode: string) => {
 const response = await api.get("/exam/options", {
  params: {
   programcode: programCode,
  },
 });
 return response.data;
};

export const downloadLaudo = async (id: string, programCode: string) => {
 const response = await api.get("/exam/voucherattachment", {
  params: {
   programcode: programCode,
   examid: id,
  },
  responseType: "blob",
  headers: {},
 });
 return response;
};

export const getListExamPending = async () => {
 const response = await api.get("/exam/listexampending", {
  params: {
   programCode: programCodeEnv,
  },
 });
 return response.data;
};

export const resolvePendency = async (model: ResolveExamPendency) => {
 const response = await api.post("/exam/examresolvependency", {
  model,
 });
 return response.data;
};
