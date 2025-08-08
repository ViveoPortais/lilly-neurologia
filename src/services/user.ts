import { IUpdateProfessionalData } from "@/types/professions";
import api from "./api";
import { IDoctorData, IUpdateDoctorData } from "@/types";
import { IChangePassword, IRegisterRepresentative, IUnblockUserRequest,IConsentStatusRequest,IUpdateConsentRequest} from "@/types/user";

const programCode = `${process.env.NEXT_PUBLIC_PROGRAM_CODE}`;

export const getUserInfo = async () => {
  const res = await api.get("/user/getuserdata", {
    params: {
      programCode: programCode,
    },
  });
  return res.data;
};

export const updateDoctorInfo = async (data: IUpdateDoctorData) => {
  const res = await api.put("/doctor/updatedoctor", data);
  return res.data;
};

export const updateProfessional = async (data: IUpdateProfessionalData) => {
  const res = await api.put("/healthProfessional/updatehealthprofessional", {
    ...data,
    programCode: programCode,
  });
  return res.data;
};

export const changePassword = async (data: IChangePassword) => {
  const res = await api.post("/user/changepassword", {
    ...data,
    programCode: programCode,
  });
  return res.data;
};

export const registerRepresentative = async (data: IRegisterRepresentative) => {
  const res = await api.post("/user/add", data);
  return res.data;
};

export const getBlockedUsers = async () => {
  const response = await api.get("/user/blockedusers", {
    params: { programCode: programCode },
  });
  return response.data;
};

export const unblockUser = async (dto: IUnblockUserRequest) => {
  const response = await api.post("/user/unblock", dto);
  return response.data;
};

export const getConsentStatus = async () => {
  const res = await api.get("/user/consent-status", {
    params: { programCode },
  });
  return res.data;
};

export const updateConsentStatus = async (consent: boolean = true) => {
  const res = await api.post<void>("/user/consent-status", { programCode, consent });
  return res.data;
};