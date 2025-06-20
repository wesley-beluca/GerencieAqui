<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <router-link to="/" class="header-link">
        <h1>GerencieAqui</h1>
      </router-link>
    </div>
    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item">
        <i class="pi pi-chart-bar"></i>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/transacoes" class="nav-item">
        <i class="pi pi-wallet"></i>
        <span>Transações</span>
      </router-link>
    </nav>
    <div class="sidebar-footer">
      <button class="logout-button" @click="logout">
        <i class="pi pi-sign-out"></i>
        <span>Sair</span>
      </button>
    </div>
  </aside>
</template>

<script>
import { useAuthStore } from '../../store'
import { useRouter } from 'vue-router'

export default {
  name: 'SidebarComponent',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const logout = () => {
      authStore.logout()
      router.push('/login')
    }

    return {
      logout
    }
  }
}
</script>

<style>
@import './Sidebar.css';
</style>
