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
        
        return true
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao fazer login'
        return false
      } finally {
        this.isLoading = false
      }
    },
    
    async logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    },
    
    async fetchUserProfile() {
      this.isLoading = true
      
      try {
        const response = await api.get('/auth/profile')
        this.user = response.data
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar perfil'
      } finally {
        this.isLoading = false
      }
    }
  }
})
