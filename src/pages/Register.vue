<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>GerencieAqui</h1>
      </div>
      
      <div class="auth-form">
        <h2>Criar Conta</h2>
        <p>Preencha os dados abaixo para criar sua conta</p>
        
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
                placeholder="Confirme sua senha"
                class="w-full"
                :class="{ 'p-invalid': errors.confirmPassword }"
                required
              />
            </div>
            <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
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
  name: 'Register',
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const form = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
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
      } else if (form.value.username.length > 50) {
        newErrors.username = 'O nome de usuário deve ter no máximo 50 caracteres'
      }
      
      if (!form.value.email) {
        newErrors.email = 'O e-mail é obrigatório'
      } else if (!/^\S+@\S+\.\S+$/.test(form.value.email)) {
        newErrors.email = 'Digite um e-mail válido'
      } else if (form.value.email.length > 100) {
        newErrors.email = 'O e-mail deve ter no máximo 100 caracteres'
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
      isLoading,
      authError,
      handleRegister
    }
  }
}
</script>

<style>
@import '../assets/styles/auth.css';
</style>
