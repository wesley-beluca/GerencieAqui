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
        const dataFim = new Date().toISOString().split('T')[0]
        const dataInicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
        
        const summaryResponse = await api.get(`/ResumoFinanceiro?dataInicio=${dataInicio}&dataFim=${dataFim}`)
        
        if (summaryResponse.data && summaryResponse.data.success) {
          this.summary = {
            totalReceitas: summaryResponse.data.data?.totalReceitas || 0,
            totalDespesas: summaryResponse.data.data?.totalDespesas || 0,
            saldoAtual: summaryResponse.data.data?.saldoFinal || 0,
            saldoMensal: summaryResponse.data.data?.totalReceitas - summaryResponse.data.data?.totalDespesas || 0
          }
        }
        
        if (summaryResponse.data && summaryResponse.data.success) {
          const transacoesPorDia = summaryResponse.data.data?.transacoesPorDia || []
          
          // Preparar dados para gráficos
          const receitas = []
          const despesas = []
          
          transacoesPorDia.forEach(dia => {
            receitas.push({
              data: dia.data,
              valor: dia.totalReceitas
            })
            
            despesas.push({
              data: dia.data,
              valor: dia.totalDespesas
            })
          })
          
          this.chartData = {
            receitas: receitas,
            despesas: despesas
          }
          
          // Obter transações recentes do resumo
          const todasTransacoes = []
          transacoesPorDia.forEach(dia => {
            if (dia.transacoes && dia.transacoes.length > 0) {
              todasTransacoes.push(...dia.transacoes)
            }
          })
          
          this.transacoesRecentes = todasTransacoes
            .sort((a, b) => new Date(b.data) - new Date(a.data))
            .slice(0, 5)
        }
      } catch (error) {
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
        
        // Usar o ResumoFinanceiro para obter os dados para os gráficos
        const response = await api.get(`/ResumoFinanceiro?dataInicio=${dataInicio}&dataFim=${dataFim}`)
        
        if (response.data && response.data.success) {
          const transacoesPorDia = response.data.data?.transacoesPorDia || []
          
          const receitas = []
          const despesas = []
          
          transacoesPorDia.forEach(dia => {
            receitas.push({
              data: dia.data,
              valor: dia.totalReceitas
            })
            
            despesas.push({
              data: dia.data,
              valor: dia.totalDespesas
            })
          })
          
          this.chartData = {
            receitas: receitas,
            despesas: despesas
          }
        } else {
          throw new Error(response.data?.message || 'Erro ao buscar dados dos gráficos')
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Erro ao buscar dados dos gráficos'
      } finally {
        this.isLoading = false
      }
    }
  }
})
