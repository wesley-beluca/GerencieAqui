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
  response => response,
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
    
    return Promise.reject(error)
  }
)

export default api
