import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 10000, // 10 segundos
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@EcommerceApp:token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:

          localStorage.removeItem('@EcommerceApp:token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Acesso negado');
          break;
        case 404:
          console.error('Recurso não encontrado');
          break;
        case 500:
          console.error('Erro interno do servidor');
          break;
        default:
          console.error('Erro na requisição', error.response);
      }
    } else if (error.request) {
      console.error('Sem resposta do servidor');
    } else {
      console.error('Erro ao configurar requisição');
    }
    return Promise.reject(error);
  }
);

export default api;