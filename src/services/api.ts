import axios from "axios";
import useSession from "../hooks/useSession";
import { toast } from "react-toastify";


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: "",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    "Access-Control-Allow-Headers":
      "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.code === 'ERR_NETWORK' || !error.response) {
      useSession.getState().onLogout();
      toast.error("Sua sessão expirou, faça o login novamente");
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
    return Promise.reject(error);
  }
);


export default api;

export const AddressData = async (cep: string) => {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep.replace('-', '')}/json/`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do CEP:', error);
    return null;
  }
};
