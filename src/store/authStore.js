import { defineStore } from 'pinia'
import api from './api'

// Store de autenticação
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },
  
  actions: {
    async login(credentials) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/login', credentials)
        this.token = response.data.token
        this.user = response.data.user
        
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Nome de usuário ou senha inválidos'
        return false
      } finally {
        this.isLoading = false
      }
    },
    
    async register(userData) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/register', userData)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao registrar usuário'
        return false
      } finally {
        this.isLoading = false
      }
    },
    
    async forgotPassword(email) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/forgot-password', { email })
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao processar solicitação'
        return false
      } finally {
        this.isLoading = false
      }
    },
    
    async resetPassword(resetData) {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.post('/auth/reset-password', resetData)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao redefinir senha'
        return false
      } finally {
        this.isLoading = false
      }
    },
    
    async logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    
    async fetchUserProfile() {
      if (!this.token) return false
      
      this.isLoading = true
      
      try {
        const response = await api.get('/auth/profile')
        this.user = response.data
        localStorage.setItem('user', JSON.stringify(this.user))
        return true
      } catch (error) {
        if (error.response?.status === 401) {
          // Token inválido ou expirado
          this.logout()
        }
        this.error = error.response?.data?.message || 'Erro ao buscar perfil'
        return false
      } finally {
        this.isLoading = false
      }
    },
    
    initAuth() {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      
      if (token && userStr) {
        try {
          this.token = token
          this.user = JSON.parse(userStr)
          return true
        } catch (e) {
          this.logout()
          return false
        }
      }
      return false
    }
  }
})
