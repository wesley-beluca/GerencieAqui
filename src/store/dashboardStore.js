import { defineStore } from 'pinia'
import api from './api'

// Store do dashboard
export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    summary: {
      totalReceitas: 0,
      totalDespesas: 0,
      saldoAtual: 0,
      saldoMensal: 0
    },
    chartData: {
      receitas: [],
      despesas: []
    },
    transacoesRecentes: [],
    isLoading: false,
    error: null
  }),
  
  getters: {
    balanceStatus: (state) => {
      if (state.summary.saldoMensal > 0) return 'positive'
      if (state.summary.saldoMensal < 0) return 'negative'
      return 'neutral'
    },
    
    monthlyTransactions: (state) => {
      return state.transacoesRecentes.filter(t => {
        const transactionDate = new Date(t.data)
        const today = new Date()
        return transactionDate.getMonth() === today.getMonth() && 
               transactionDate.getFullYear() === today.getFullYear()
      })
    }
  },
  
  actions: {
    async fetchDashboardData() {
      this.isLoading = true
      this.error = null
      
      try {
        // Obter data atual e primeiro dia do mês para o período
        const dataFim = new Date().toISOString().split('T')[0]
        const dataInicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
        
        // Buscar resumo financeiro
        const summaryResponse = await api.get(`/ResumoFinanceiro?dataInicio=${dataInicio}&dataFim=${dataFim}`)
        
        if (summaryResponse.data && summaryResponse.data.success) {
          this.summary = {
            totalReceitas: summaryResponse.data.data?.totalReceitas || 0,
            totalDespesas: summaryResponse.data.data?.totalDespesas || 0,
            saldoAtual: summaryResponse.data.data?.saldoAtual || 0,
            saldoMensal: summaryResponse.data.data?.saldoMensal || 0
          }
        }
        
        // Buscar dados para gráficos
        const chartResponse = await api.get(`/GraficosFinanceiros?dataInicio=${dataInicio}&dataFim=${dataFim}`)
        
        if (chartResponse.data && chartResponse.data.success) {
          this.chartData = {
            receitas: chartResponse.data.data?.receitas || [],
            despesas: chartResponse.data.data?.despesas || []
          }
        }
        
        // Buscar transações recentes
        const transactionsResponse = await api.get('/Transacoes/Recentes?limite=5')
        
        if (transactionsResponse.data && transactionsResponse.data.success) {
          this.transacoesRecentes = transactionsResponse.data.data || []
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error)
        this.error = error.response?.data?.message || error.message || 'Erro ao carregar dados do dashboard'
      } finally {
        this.isLoading = false
      }
    },
    
    async fetchChartData(periodo) {
      this.isLoading = true
      this.error = null
      
      try {
        let dataInicio, dataFim
        const hoje = new Date()
        dataFim = hoje.toISOString().split('T')[0]
        
        switch (periodo) {
          case 'semana':
            // Últimos 7 dias
            dataInicio = new Date(hoje.setDate(hoje.getDate() - 7)).toISOString().split('T')[0]
            break
          case 'mes':
            // Mês atual
            dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0]
            break
          case 'trimestre':
            // Últimos 3 meses
            dataInicio = new Date(hoje.setMonth(hoje.getMonth() - 3)).toISOString().split('T')[0]
            break
          case 'ano':
            // Ano atual
            dataInicio = new Date(hoje.getFullYear(), 0, 1).toISOString().split('T')[0]
            break
          default:
            // Mês atual (padrão)
            dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0]
        }
        
        const response = await api.get(`/GraficosFinanceiros?dataInicio=${dataInicio}&dataFim=${dataFim}`)
        
        if (response.data && response.data.success) {
          this.chartData = {
            receitas: response.data.data?.receitas || [],
            despesas: response.data.data?.despesas || []
          }
        } else {
          throw new Error(response.data?.message || 'Erro ao buscar dados dos gráficos')
        }
      } catch (error) {
        console.error('Erro ao buscar dados dos gráficos:', error)
        this.error = error.response?.data?.message || error.message || 'Erro ao buscar dados dos gráficos'
      } finally {
        this.isLoading = false
      }
    }
  }
})
