<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>GerencieAqui</h1>
      </div>
      
      <div class="auth-form">
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
            class="p-button-primary w-full auth-button"
            :loading="isLoading"
          />
          
          <div class="auth-link">
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
      
      <div class="auth-footer">
        <p>&copy; {{ new Date().getFullYear() }} Wesley Augusto Beluca. Todos os direitos reservados.</p>
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

<style>
@import '../assets/styles/auth.css';
</style>
