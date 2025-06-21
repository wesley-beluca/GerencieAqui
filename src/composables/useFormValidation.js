import { ref } from 'vue'
export function useFormValidation() {
  const errors = ref({})

  const validateEmail = (email) => {
    const fieldErrors = {}
    
    if (!email) {
      fieldErrors.email = 'O e-mail é obrigatório'
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      fieldErrors.email = 'Digite um e-mail válido'
    }
    
    errors.value = { ...errors.value, ...fieldErrors }
    return Object.keys(fieldErrors).length === 0
  }

  const validateUsername = (username) => {
    const fieldErrors = {}
    
    if (!username) {
      fieldErrors.username = 'O nome de usuário é obrigatório'
    } else if (username.length < 3) {
      fieldErrors.username = 'O nome de usuário deve ter pelo menos 3 caracteres'
    }
    
    errors.value = { ...errors.value, ...fieldErrors }
    return Object.keys(fieldErrors).length === 0
  }

  const clearErrors = () => {
    errors.value = {}
  }

  return {
    errors,
    validateEmail,
    validateUsername,
    clearErrors
  }
}
