// Arquivo index.js - Exporta todas as stores do projeto
import { useAuthStore } from './authStore'
import { useTransactionStore } from './transactionStore'
import { useDashboardStore } from './dashboardStore'

// Exportar todas as stores para uso em componentes
export {
  useAuthStore,
  useTransactionStore,
  useDashboardStore
}