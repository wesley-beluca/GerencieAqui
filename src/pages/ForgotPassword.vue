<template>
  <div class="forgot-password-page">
    <div class="forgot-password-container">
      <div class="forgot-password-header">
        <h1>GerencieAqui</h1>
      </div>
      
      <div class="forgot-password-form">
        <h2>Recuperar Senha</h2>
        <p>Digite seu e-mail para receber instruções de recuperação</p>
        
        <form @submit.prevent="handleForgotPassword">
          <div class="form-group">
            <label for="email">E-mail</label>
            <div class="input-with-icon">
              <span class="icon-container"><i class="pi pi-envelope"></i></span>
              <InputText 
                id="email" 
                v-model="form.email" 
                type="email" 
                placeholder="Seu e-mail"
                class="w-full"
                :class="{ 'p-invalid': errors.email }"
                required
              />
            </div>
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>
          
          <Button 
            type="submit" 
            label="Enviar Instruções" 
            icon="pi pi-send" 
            class="forgot-password-button w-full"
            :loading="isLoading"
          />
          
          <div class="login-link">
            <router-link to="/login">Voltar para o login</router-link>
          </div>
        </form>
        
        <div v-if="authError" class="auth-error">
          <i class="pi pi-exclamation-triangle"></i>
          <span>{{ authError }}</span>
        </div>
        
        <div v-if="successMessage" class="success-message">
          <i class="pi pi-check-circle"></i>
          <span>{{ successMessage }}</span>
        </div>
      </div>
      
      <div class="forgot-password-footer">
        <p>&copy; 2025 Wesley Augusto Beluca. Todos os direitos reservados.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from '../store'

export default {
  name: 'ForgotPassword',
  
  setup() {
    const authStore = useAuthStore()
    
    const form = ref({
      email: ''
    })
    
    const errors = ref({})
    const isLoading = ref(false)
    const successMessage = ref('')
    
    const authError = computed(() => authStore.error)
    
    const validate = () => {
      const newErrors = {}
      
      if (!form.value.email) {
        newErrors.email = 'O e-mail é obrigatório'
      } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
        newErrors.email = 'Digite um e-mail válido'
      }
      
      errors.value = newErrors
      
      return Object.keys(newErrors).length === 0
    }
    
    const handleForgotPassword = async () => {
      if (!validate()) {
        return
      }
      
      isLoading.value = true
      successMessage.value = ''
      
      try {
        const result = await authStore.forgotPassword(form.value.email)
        
        if (result) {
          successMessage.value = 'Instruções para redefinição de senha foram enviadas para seu email'
          form.value.email = ''
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
      successMessage,
      handleForgotPassword
    }
  }
}
</script>

<style scoped>
.forgot-password-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--light-color);
}

.forgot-password-container {
  width: 100%;
  max-width: 400px;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.forgot-password-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.forgot-password-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0;
}

.forgot-password-form h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--header-color);
}

.forgot-password-form p {
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

.input-with-icon {
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid var(--surface-border);
  border-radius: 4px;
  background-color: var(--surface-card);
  overflow: hidden;
}

.input-with-icon:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 1px var(--primary-color);
}

.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 0.75rem;
  color: var(--text-color-secondary);
}

.input-with-icon .p-inputtext {
  flex: 1;
  border: none;
  background-color: transparent;
  box-shadow: none;
  padding: 0.75rem;
}

.input-with-icon .p-inputtext:focus {
  box-shadow: none;
}

.forgot-password-button {
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

.success-message {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--success-color);
  padding: 0.75rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
  color: var(--text-color);
  font-size: 0.9rem;
}

.login-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}

.forgot-password-footer {
  text-align: center;
  margin-top: 2rem;
  color: var(--gray-color);
  font-size: 0.9rem;
}
</style>
