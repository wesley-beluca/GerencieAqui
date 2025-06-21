<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>GerencieAqui</h1>
      </div>
      
      <div class="login-form">
        <h2>Login</h2>
        <p>Entre com suas credenciais para acessar o sistema</p>
        
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">E-mail</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-envelope" />
              <InputText 
                id="email" 
                v-model="form.email" 
                type="email" 
                placeholder="Seu e-mail"
                class="w-full"
                :class="{ 'p-invalid': errors.email }"
                required
              />
            </span>
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>
          
          <div class="form-group">
            <label for="password">Senha</label>
            <span class="p-input-icon-left w-full">
              <i class="pi pi-lock" />
              <InputText 
                id="password" 
                v-model="form.password" 
                type="password" 
                placeholder="Sua senha"
                class="w-full"
                :class="{ 'p-invalid': errors.password }"
                required
              />
            </span>
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>
          
          <div class="form-footer">
            <div class="remember-me">
              <input type="checkbox" id="remember" v-model="form.remember" />
              <label for="remember">Lembrar-me</label>
            </div>
            
            <a href="#" class="forgot-password">Esqueceu a senha?</a>
          </div>
          
          <Button 
            type="submit" 
            label="Entrar" 
            icon="pi pi-sign-in" 
            class="login-button w-full"
            :loading="isLoading"
          />
        </form>
        
        <div v-if="authError" class="auth-error">
          <i class="pi pi-exclamation-triangle"></i>
          <span>{{ authError }}</span>
        </div>
      </div>
      
      <div class="login-footer">
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
      email: '',
      password: '',
      remember: false
    })
    
    const errors = ref({})
    const isLoading = ref(false)
    
    const authError = computed(() => authStore.error)
    
    const validate = () => {
      const newErrors = {}
      
      if (!form.value.email) {
        newErrors.email = 'O e-mail é obrigatório'
      } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
        newErrors.email = 'Digite um e-mail válido'
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
          email: form.value.email,
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

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--light-color);
}

.login-container {
  width: 100%;
  max-width: 400px;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.login-logo {
  height: 60px;
  margin-bottom: 1rem;
}

.login-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0;
}

.login-form h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--header-color);
}

.login-form p {
  color: var(--gray-color);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-group .p-inputtext {
  color: var(--text-color);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
}

.login-button {
  margin-bottom: 1.5rem;
}

.auth-error {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--danger-color);
  padding: 0.75rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.login-footer {
  text-align: center;
  margin-top: 2rem;
  color: var(--gray-color);
  font-size: 0.9rem;
}
</style> 