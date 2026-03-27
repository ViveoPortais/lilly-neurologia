import axios from "axios";
import { toast } from "react-toastify";


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && window.location.pathname.includes('/dashboard')) {
        toast.error("Sua sessão expirou, faça o login novamente");
        localStorage.removeItem('session-storage');
        setTimeout(() => {
          window.location.href = '/signin';
        }, 1000);
      }
    }

    if(error.code === 'ERR_NETWORK'){
      console.log(error);
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
