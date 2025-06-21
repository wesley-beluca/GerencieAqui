import { ref } from 'vue'
export function usePasswordValidation() {
  const passwordErrors = ref({})

  const validatePassword = (password, confirmPassword = null) => {
    const errors = {}

    if (!password) {
      errors.password = 'A senha é obrigatória'
    } else if (password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres'
    }

    if (confirmPassword !== null) {
      if (!confirmPassword) {
        errors.confirmPassword = 'Confirme sua senha'
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'As senhas não conferem'
      }
    }

    passwordErrors.value = errors
    return Object.keys(errors).length === 0
  }

  return {
    passwordErrors,
    validatePassword
  }
}
