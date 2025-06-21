<template>
  <ErrorLayout
    errorCode="404"
    title="Página não encontrada"
    message="A página que você está procurando não existe ou foi removida."
  >
    <Button label="Voltar ao Dashboard" icon="pi pi-home" @click="goHome" />
  </ErrorLayout>
</template>

<script>
import { useRouter } from 'vue-router'
import ErrorLayout from '../components/layout/ErrorLayout.vue'

export default {
  name: 'NotFound',
  
  components: {
    ErrorLayout
  },
  
  setup() {
    const router = useRouter()
    
    const goHome = () => {
      router.push('/')
    }
    
    return {
      goHome
    }
  }
}
</script>