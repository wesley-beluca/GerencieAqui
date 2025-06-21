<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>GerencieAqui</h1>
      </div>
      
      <div class="auth-form">
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
            class="auth-button w-full"
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

<style>
@import '../assets/styles/auth.css';
</style>
