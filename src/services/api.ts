import axios from "axios";

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
    if (error.response?.status === 401 || error.code === 'ERR_NETWORK') {
      if (typeof window !== 'undefined' && window.location.pathname.includes('/dashboard')) {
        alert('Sua sessão expirou. Você será redirecionado para a página de login.');
        localStorage.removeItem('session-storage');
        setTimeout(() => {
          window.location.href = '/signin';
        }, 1000);
      }
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
