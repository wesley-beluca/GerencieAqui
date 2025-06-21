<template>
  <AuthLayout 
    title="Redefinir Senha" 
    subtitle="Digite sua nova senha"
    :authError="authError"
    :successMessage="successMessage"
  >
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
            :class="{ 'p-invalid': passwordErrors.password }"
            required
          />
        </div>
        <small v-if="passwordErrors.password" class="p-error">{{ passwordErrors.password }}</small>
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
            :class="{ 'p-invalid': passwordErrors.confirmPassword }"
            required
          />
        </div>
        <small v-if="passwordErrors.confirmPassword" class="p-error">{{ passwordErrors.confirmPassword }}</small>
      </div>
      
      <Button 
        type="submit" 
        label="Redefinir Senha" 
        icon="pi pi-check" 
        class="auth-button w-full"
        :loading="isLoading"
      />
      
      <div class="auth-link">
        <router-link to="/login">Voltar para o login</router-link>
      </div>
    </form>
  </AuthLayout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store'
import { usePasswordValidation } from '../composables/usePasswordValidation'
import { useAuthForm } from '../composables/useAuthForm'
import AuthLayout from '../components/layout/AuthLayout.vue'

export default {
  name: 'ResetPassword',
  
  components: {
    AuthLayout
  },
  
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    
    // Usar composables
    const { passwordErrors, validatePassword } = usePasswordValidation()
    const { isLoading, successMessage, authError, clearMessages, setSuccessMessage } = useAuthForm()
    
    const form = ref({
      token: '',
      password: '',
      confirmPassword: ''
    })
    
    const tokenValid = ref(true)
    
    onMounted(() => {
      // Obter o token da URL
      const token = route.query.token
      if (!token) {
        tokenValid.value = false
        passwordErrors.value.token = 'Token inválido ou ausente'
      } else {
        form.value.token = token
      }
    })
    
    const validate = () => {
      if (!form.value.token) {
        passwordErrors.value.token = 'Token inválido ou ausente'
        return false
      }
      
      // Usar o composable de validação de senha
      return validatePassword(form.value.password, form.value.confirmPassword)
    }
    
    const handleResetPassword = async () => {
      if (!validate()) {
        return
      }
      
      isLoading.value = true
      clearMessages()
      
      try {
        const result = await authStore.resetPassword({
          token: form.value.token,
          password: form.value.password,
          confirmPassword: form.value.confirmPassword
        })
        
        if (result) {
          setSuccessMessage('Senha redefinida com sucesso')
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
      passwordErrors,
      isLoading,
      authError,
      successMessage,
      tokenValid,
      handleResetPassword
    }
  }
}
</script>
