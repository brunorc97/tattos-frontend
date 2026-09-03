import axios from 'axios';

/**
 * Cliente HTTP Centralizado (Axios) - ERP TattOS
 * 
 * Diretrizes de Arquitetura e Segurança:
 * 1. Isolamento Front/Back: O front-end atua estritamente na camada de apresentação.
 *    Nenhuma regra de negócio crítica, permissão RBAC sensível ou lógica criptográfica
 *    reside no cliente; tudo é validado no Back-end (Spring Boot 4 / Java 25 LTS).
 * 2. Gerenciamento de Sessão: O token JWT emitido pelo Spring Security é recuperado
 *    do armazenamento de sessão seguro (sessionStorage / AuthContext em memória) e
 *    anexado via Bearer token em cada requisição.
 * 3. Tratamento Global de Falhas: Interceptor captura respostas 401 (token expirado/inválido)
 *    e 403 (acesso negado), limpando o estado de autenticação e redirecionando para login.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Interceptor de Requisição: Injeção do JWT Token de Sessão
 */
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('tattos_auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Resposta: Tratamento Global de Erros de Autenticação / Autorização
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      // 401 Unauthorized: Sessão expirada ou token revogado/inválido
      if (response.status === 401) {
        sessionStorage.removeItem('tattos_auth_token');
        sessionStorage.removeItem('tattos_user_profile');
        
        // Redireciona de forma limpa para a tela de login apenas se já não estiver nela
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?expired=true';
        }
      }

      // 403 Forbidden: Usuário autenticado, mas sem privilégios para o recurso no backend
      if (response.status === 403) {
        console.error('[Segurança] Acesso negado pelo servidor:', response.data?.message || 'Permissão insuficiente.');
      }
    } else if (error.request) {
      // Falha de conectividade ou indisponibilidade da API do Spring Boot
      console.error('[Rede] Não foi possível conectar ao servidor da API TattOS.');
    }

    return Promise.reject(error);
  }
);

export default api;
