import { ref, computed } from 'vue'
import { useAuthStore } from '../store'


export function useAuthForm() {
  const authStore = useAuthStore()
  const isLoading = ref(false)
  const successMessage = ref('')
  
  const authError = computed(() => authStore.error)
  
  const clearMessages = () => {
    successMessage.value = ''
    authStore.$reset() 
  }
  
  const setSuccessMessage = (message) => {
    successMessage.value = message
  }

  return {
    isLoading,
    successMessage,
    authError,
    clearMessages,
    setSuccessMessage
  }
}
