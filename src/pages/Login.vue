<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>GerencieAqui</h1>
      </div>
      
      <div class="auth-form">
        <h2>Login</h2>
        <p>Entre com suas credenciais para acessar o sistema</p>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username">Nome de usuário</label>
            <div class="input-with-icon">
              <span class="icon-container"><i class="pi pi-user"></i></span>
              <InputText 
                id="username" 
                v-model="form.username" 
                type="text" 
                placeholder="Seu nome de usuário"
                class="w-full"
                :class="{ 'p-invalid': errors.username }"
                required
              />
            </div>
            <small v-if="errors.username" class="p-error">{{ errors.username }}</small>
          </div>
          
          <div class="form-group">
            <label for="password">Senha</label>
            <div class="input-with-icon">
              <span class="icon-container"><i class="pi pi-lock"></i></span>
              <InputText 
                id="password" 
                v-model="form.password" 
                type="password" 
                placeholder="Sua senha"
                class="w-full"
                :class="{ 'p-invalid': errors.password }"
                required
              />
            </div>
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>
          
          <div class="form-footer">
            <div class="remember-me">
              <input type="checkbox" id="remember" v-model="form.remember" />
              <label for="remember">Lembrar-me</label>
            </div>
            
            <router-link to="/forgot-password" class="forgot-password">Esqueceu a senha?</router-link>
          </div>
          
          <Button 
            type="submit" 
            label="Entrar" 
            icon="pi pi-sign-in" 
            class="auth-button w-full"
            :loading="isLoading"
          />
          
          <div class="auth-link">
            Não tem uma conta? <router-link to="/register">Registre-se</router-link>
          </div>
        </form>
        
        <div v-if="authError" class="auth-error">
          <i class="pi pi-exclamation-triangle"></i>
          <span>{{ authError }}</span>
        </div>
      </div>
      
      <div class="auth-footer">
        <p>&copy; 2025 Wesley Augusto Beluca. Todos os direitos reservados.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store'

export default {
  name: 'Login',
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = ref({
      username: '',
      password: '',
      remember: false
    })
    
    const errors = ref({})
    const isLoading = ref(false)
    
    const authError = computed(() => authStore.error)
    
    const validate = () => {
      const newErrors = {}
      
      if (!form.value.username) {
        newErrors.username = 'O nome de usuário é obrigatório'
      } else if (form.value.username.length < 3) {
        newErrors.username = 'O nome de usuário deve ter pelo menos 3 caracteres'
      }
      
      if (!form.value.password) {
        newErrors.password = 'A senha é obrigatória'
      } else if (form.value.password.length < 6) {
        newErrors.password = 'A senha deve ter pelo menos 6 caracteres'
      }
      
      errors.value = newErrors
      
      return Object.keys(newErrors).length === 0
    }
    
    const handleLogin = async () => {
      if (!validate()) {
        return
      }
      
      isLoading.value = true
      
      try {
        const success = await authStore.login({
          username: form.value.username,
          password: form.value.password
        })
        
        if (success) {
          router.push('/')
        }
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      form,
      errors,
      isLoading,
      authError,
      handleLogin
    }
  }
}
</script>

<style>
@import '../assets/styles/auth.css';
</style> 