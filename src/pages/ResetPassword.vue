<template>
  <div class="reset-password-page">
    <div class="reset-password-container">
      <div class="reset-password-header">
        <h1>GerencieAqui</h1>
      </div>
      
      <div class="reset-password-form">
        <h2>Redefinir Senha</h2>
        <p>Digite sua nova senha</p>
        
        <form @submit.prevent="handleResetPassword">
          <div class="form-group">
            <label for="password">Nova Senha</label>
            <div class="input-with-icon">
              <span class="icon-container"><i class="pi pi-lock"></i></span>
              <InputText 
                id="password" 
                v-model="form.password" 
                type="password" 
                placeholder="Nova senha"
                class="w-full"
                :class="{ 'p-invalid': errors.password }"
                required
              />
            </div>
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirmar Senha</label>
            <div class="input-with-icon">
              <span class="icon-container"><i class="pi pi-lock"></i></span>
              <InputText 
                id="confirmPassword" 
                v-model="form.confirmPassword" 
                type="password" 
                placeholder="Confirme sua nova senha"
                class="w-full"
                :class="{ 'p-invalid': errors.confirmPassword }"
                required
              />
            </div>
            <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
          </div>
          
          <Button 
            type="submit" 
            label="Redefinir Senha" 
            icon="pi pi-check" 
            class="reset-password-button w-full"
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
      
      <div class="reset-password-footer">
        <p>&copy; 2025 Wesley Augusto Beluca. Todos os direitos reservados.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store'

export default {
  name: 'ResetPassword',
  
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = ref({
      token: '',
      password: '',
      confirmPassword: ''
    })
    
    const errors = ref({})
    const isLoading = ref(false)
    const successMessage = ref('')
    const tokenValid = ref(true)
    
    const authError = computed(() => authStore.error)
    
    onMounted(() => {
      // Obter o token da URL
      const token = route.query.token
      if (!token) {
        tokenValid.value = false
        errors.value.token = 'Token inválido ou ausente'
      } else {
        form.value.token = token
      }
    })
    
    const validate = () => {
      const newErrors = {}
      
      if (!form.value.token) {
        newErrors.token = 'Token inválido ou ausente'
        return false
      }
      
      if (!form.value.password) {
        newErrors.password = 'A senha é obrigatória'
      } else if (form.value.password.length < 6) {
        newErrors.password = 'A senha deve ter pelo menos 6 caracteres'
      }
      
      if (!form.value.confirmPassword) {
        newErrors.confirmPassword = 'Confirme sua senha'
      } else if (form.value.password !== form.value.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não conferem'
      }
      
      errors.value = newErrors
      
      return Object.keys(newErrors).length === 0
    }
    
    const handleResetPassword = async () => {
      if (!validate()) {
        return
      }
      
      isLoading.value = true
      successMessage.value = ''
      
      try {
        const result = await authStore.resetPassword({
          token: form.value.token,
          password: form.value.password,
          confirmPassword: form.value.confirmPassword
        })
        
        if (result) {
          successMessage.value = 'Senha redefinida com sucesso'
          // Redirecionar para login após 2 segundos
          setTimeout(() => {
            router.push('/login')
          }, 2000)
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
      tokenValid,
      handleResetPassword
    }
  }
}
</script>

<style scoped>
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

.reset-password-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--light-color);
}

.reset-password-container {
  width: 100%;
  max-width: 400px;
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.reset-password-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.reset-password-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0;
}

.reset-password-form h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--header-color);
}

.reset-password-form p {
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

.reset-password-button {
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

.reset-password-footer {
  text-align: center;
  margin-top: 2rem;
  color: var(--gray-color);
  font-size: 0.9rem;
}
</style>
