import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: { requiresAuth: false } // Desativando necessidade de autenticação
  },
  {
    path: '/transacoes',
    name: 'Transacoes',
    component: () => import('../pages/Transacoes.vue'),
    meta: { requiresAuth: false } // Desativando necessidade de autenticação
  },
  {
    // Mantendo login mas não será usado por enquanto
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Guarda de rota simplificado - sempre permite acesso
router.beforeEach((to, from, next) => {
  next() // Sempre permite navegação
})

export default router