<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-header">
        <h1>GerencieAqui</h1>
      </div>
      
      <div class="auth-form">
        <h2>{{ title }}</h2>
        <p v-if="subtitle">{{ subtitle }}</p>
        
        <slot></slot>
        
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
export default {
  name: 'AuthLayout',
  
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    authError: {
      type: String,
      default: ''
    },
    successMessage: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
@import '../../assets/styles/auth.css';
</style>
