<template>
  <div class="layout-wrapper">
    <Sidebar />
    
    <main class="content">
      <header class="header">
        <div class="header-title">
          <h2>{{ pageTitle }}</h2>
        </div>
        
        <div class="header-actions">
          <span class="user-info">
            <i class="pi pi-user"></i>
            {{ userName }}
          </span>
          <Button 
            icon="pi pi-sign-out" 
            class="p-button-text p-button-rounded logout-button" 
            @click="logout" 
            tooltip="Sair"
            tooltipOptions="{position: 'bottom'}"
          />
        </div>
      </header>
      
      <div class="page-content">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store'
import Sidebar from '../components/layout/Sidebar.vue'

export default {
  name: 'MainLayout',
  components: {
    Sidebar
  },
  
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    
    const pageTitle = computed(() => {
      return route.name == 'Transacoes' ? 'Transações' : 'Dashboard'
    })
    
    const userName = computed(() => {
      return authStore.user?.name || 'Usuário'
    })
    
    const logout = async () => {
      await authStore.logout()
      router.push('/login')
    }
    
    return {
      pageTitle,
      userName,
      logout
    }
  }
}
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  min-height: 100vh;
}

/* Estilos da barra lateral foram movidos para o componente Sidebar */

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--light-color);
  margin-left: 250px; /* Adiciona margem correspondente à largura da barra lateral */
  width: calc(100% - 250px); /* Ajusta a largura para evitar overflow horizontal */
}

.header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  background-color: var(--card-bg);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.header-title h2 {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text-color);
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  color: var(--text-color);
}

.user-info i {
  margin-right: 8px;
  font-size: 1.2rem;
}

.logout-button {
  margin-left: 1rem;
  color: var(--text-color);
}

.logout-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--primary-color);
}

.page-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}
</style> 