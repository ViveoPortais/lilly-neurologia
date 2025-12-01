import { IForgetPasswordData, IForgetPasswordDataOthers, ILoginData, IResendToken } from "@/types";
import api from "./api";

const programCode = `${process.env.NEXT_PUBLIC_PROGRAM_CODE}`;

export const login = async (data: ILoginData) => {
  const res = await api.post("/mfa/login", {
    ...data,
    healthProgramCode: programCode,
  });
  return res.data;
};

export const validateToken = async (data: ILoginData) => {
  const res = await api.post("/mfa/validate-token", {
    ...data,
    healthProgramCode: programCode,
  });
  return res.data;
};

export const forgetPassword = async (data: IForgetPasswordData) => {
  const res = await api.post("/forgotpassword/doctor", {
    ...data,
    programCode: programCode,
  });
  return res.data;
};

export const forgetPasswordOthers = async (data: IForgetPasswordDataOthers) => {
  const res = await api.post("/user/forgotpassword", {
    ...data,
    programCode: programCode,
  });
  return res.data;
};

export const resendToken = async (data: IResendToken) => {
  const res = await api.post("/resendtoken", {
    ...data,
    healthProgramCode: programCode,
  });
  return res.data;
};

export const logout = async () => {
  try {
    await api.post(`/logoff?programCode=${programCode}`);
  } 
  catch (error) {}
};
