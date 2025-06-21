<template>
  <AuthLayout 
    title="Login" 
    subtitle="Entre com suas credenciais para acessar o sistema"
    :authError="authError"
  >
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
            :class="{ 'p-invalid': passwordErrors.password }"
            required
          />
        </div>
        <small v-if="passwordErrors.password" class="p-error">{{ passwordErrors.password }}</small>
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
  name: 'Login',
  
  components: {
    AuthLayout
  },
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // Usar composables
    const { errors, validateUsername, clearErrors } = useFormValidation()
    const { passwordErrors, validatePassword } = usePasswordValidation()
    const { isLoading, authError } = useAuthForm()
    
    const form = ref({
      username: '',
      password: '',
      remember: false
    })
    
    const validate = () => {
      clearErrors()
      
      const isUsernameValid = validateUsername(form.value.username)
      const isPasswordValid = validatePassword(form.value.password)
      
      return isUsernameValid && isPasswordValid
    }
    
    const handleLogin = async () => {
      if (!validate()) {
        return
      }
      
      isLoading.value = true
      
      try {
        const success = await authStore.login({
          username: form.value.username,
          password: form.value.password,
          remember: form.value.remember
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
      passwordErrors,
      isLoading,
      authError,
      handleLogin
    }
  }
}
</script>