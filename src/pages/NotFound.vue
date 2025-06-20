<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <div class="not-found-content">
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>A página que você está procurando não existe ou foi removida.</p>
        <Button label="Voltar ao Dashboard" icon="pi pi-home" @click="goHome" />
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFound',
  
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

<style scoped>
.not-found-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--light-color);
}

.not-found-container {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  text-align: center;
}

.not-found-content {
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 3rem 2rem;
}

h1 {
  font-size: 6rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
  line-height: 1;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
  margin: 1rem 0;
  color: var(--dark-color);
}

p {
  color: var(--gray-color);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}
</style> 