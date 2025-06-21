<template>
  <AuthLayout 
    title="Recuperar Senha" 
    subtitle="Digite seu e-mail para receber instruções de recuperação"
    :authError="authError"
    :successMessage="successMessage"
  >
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
  </AuthLayout>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '../store'
import { useFormValidation } from '../composables/useFormValidation'
import { useAuthForm } from '../composables/useAuthForm'
import AuthLayout from '../components/layout/AuthLayout.vue'

export default {
  name: 'ForgotPassword',
  
  components: {
    AuthLayout
  },
  
  setup() {
    const authStore = useAuthStore()
    
    // Usar composables
    const { errors, validateEmail, clearErrors } = useFormValidation()
    const { isLoading, successMessage, authError, clearMessages, setSuccessMessage } = useAuthForm()
    
    const form = ref({
      email: ''
    })
    
    const validate = () => {
      clearErrors()
      return validateEmail(form.value.email)
    }
    
    const handleForgotPassword = async () => {
      if (!validate()) {
        return
      }
      
      isLoading.value = true
      clearMessages()
      
      try {
        const result = await authStore.forgotPassword(form.value.email)
        
        if (result) {
          setSuccessMessage('Instruções para redefinição de senha foram enviadas para seu email')
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
