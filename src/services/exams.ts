import { ExamPendingModel, ResolveExamPendency } from "@/types/diagnostic";
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

export const getListExamPending = async (doctorId?: string, flag?: string) => {
  const response = await api.get("/exam/listexampending", {
    params: {
      programCode: programCodeEnv,
      doctorId: doctorId,
      flagStatus: flag,
    },
  });
  return response.data;
};

export const resolvePendency = async (model: ExamPendingModel) => {
  const response = await api.post("/exam/resolvependency?programCode=" + programCodeEnv, model);
  return response.data;
};

export const getPendencyReasons = async () => {
  const response = await api.get("/exam/getpendencyreason", {
    params: {
      programCode: programCodeEnv,
    },
  });
  return response.data;
};

export const collectionSchedule = async (examId: string) => {
  const response = await api.get("/logisticsSchedule/collection-schedule", {
    params: {
      examId: examId,
      programCode: programCodeEnv,
    },
  });
  return response.data;
};