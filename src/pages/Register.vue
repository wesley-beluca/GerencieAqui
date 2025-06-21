<template>
  <AuthLayout 
    title="Criar Conta" 
    subtitle="Preencha os dados abaixo para criar sua conta"
    :authError="authError"
  >
    <form @submit.prevent="handleRegister">
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
            placeholder="Confirme sua senha"
            class="w-full"
            :class="{ 'p-invalid': passwordErrors.confirmPassword }"
            required
          />
        </div>
        <small v-if="passwordErrors.confirmPassword" class="p-error">{{ passwordErrors.confirmPassword }}</small>
      </div>
      
      <Button 
        type="submit" 
        label="Registrar" 
        icon="pi pi-user-plus" 
        class="auth-button w-full"
        :loading="isLoading"
      />
      
      <div class="auth-link">
        Já tem uma conta? <router-link to="/login">Faça login</router-link>
      </div>
    </form>
  </AuthLayout>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store'
import { useFormValidation } from '../composables/useFormValidation'
import { usePasswordValidation } from '../composables/usePasswordValidation'
import { useAuthForm } from '../composables/useAuthForm'
import AuthLayout from '../components/layout/AuthLayout.vue'

export default {
  name: 'Register',
  
  components: {
    AuthLayout
  },
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // Usar composables
    const { errors, validateEmail, validateUsername, clearErrors } = useFormValidation()
    const { passwordErrors, validatePassword } = usePasswordValidation()
    const { isLoading, authError } = useAuthForm()
    
    const form = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    
    const validate = () => {
      clearErrors()
      
      // Validar cada campo usando os composables
      const isUsernameValid = validateUsername(form.value.username)
      const isEmailValid = validateEmail(form.value.email)
      const isPasswordValid = validatePassword(form.value.password, form.value.confirmPassword)
      
      // Validações adicionais específicas para registro
      if (form.value.username.length > 50) {
        errors.value.username = 'O nome de usuário deve ter no máximo 50 caracteres'
      }
      
      if (form.value.email.length > 100) {
        errors.value.email = 'O e-mail deve ter no máximo 100 caracteres'
      }
      
      return isUsernameValid && isEmailValid && isPasswordValid && 
             !errors.value.username && !errors.value.email
    }
    
    const handleRegister = async () => {
      if (!validate()) {
        return
      }
      
      isLoading.value = true
      
      try {
        const result = await authStore.register({
          username: form.value.username,
          email: form.value.email,
          password: form.value.password,
          confirmPassword: form.value.confirmPassword
        })
        
        if (result) {
          // Mostrar mensagem de sucesso
          router.push('/login')
        }
      } finally {
        isLoading.value = false
      }
    }
    
    return {
      form,
      errors,
      passwordErrors,
      isLoading,
      authError,
      handleRegister
    }
  }
}
</script>
