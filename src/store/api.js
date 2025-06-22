import axios from 'axios'
import { useAuthStore } from './authStore'
import router from '../router'

// Configuração do Axios
const api = axios.create({
  baseURL: 'https://localhost:7045/api',
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  response => {
    // Verificar se a resposta segue o novo padrão de notificação
    if (response.data && Object.prototype.hasOwnProperty.call(response.data, 'sucesso')) {
      // Se não for sucesso, rejeitar a promessa com os erros
      if (!response.data.sucesso) {
        // Extrair as mensagens de erro do formato { key, message }
        const errorMessages = Array.isArray(response.data.erros) 
          ? response.data.erros.map(err => err.message || err).join(', ')
          : 'Erro na operação';
          
        return Promise.reject({
          response: {
            data: {
              message: errorMessages,
              errors: response.data.erros
            },
            status: response.status
          }
        })
      }
      // Se for sucesso, retornar apenas os dados
      response.data = {
        ...response.data,
        data: response.data.dados,
        success: response.data.sucesso
      }
    }
    return response
  },
  async error => {
    // Verificar se o erro é de autenticação (401)
    if (error.response && error.response.status === 401) {
      // Obter a instância do store de autenticação
      const authStore = useAuthStore()
      
      // Fazer logout e redirecionar para a página de login
      await authStore.logout()
      
      // Verificar se já está na página de login para evitar redirecionamento cíclico
      if (router.currentRoute.value.name !== 'Login') {
        router.push('/login')
      }
    }
    
    // Verificar se a resposta de erro segue o novo padrão de notificação
    if (error.response && error.response.data && Object.prototype.hasOwnProperty.call(error.response.data, 'sucesso') && !error.response.data.sucesso) {
      // Extrair as mensagens de erro do formato { key, message }
      error.response.data.message = Array.isArray(error.response.data.erros) 
        ? error.response.data.erros.map(err => err.message || err).join(', ')
        : 'Erro na operação';
      error.response.data.errors = error.response.data.erros
    }
    
    return Promise.reject(error)
  }
)

export default api
