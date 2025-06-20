import { defineStore } from 'pinia'
import api from './api'

// Store de transações
export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    isLoading: false,
    error: null,
    summary: {
      salesTotal: 0,
      expensesTotal: 0,
      receivableTotal: 0,
      monthlyTotal: 0
    }
  }),
  
  getters: {
    recentTransactions: (state) => {
      return state.transactions
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    },
    
    incomeTransactions: (state) => {
      return state.transactions.filter(t => t.type === 'RECEITA')
    },
    
    expenseTransactions: (state) => {
      return state.transactions.filter(t => t.type === 'DESPESA')
    }
  },
  
  actions: {
    async fetchTransactions() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.get('/Transacoes')
        console.log('Resposta da API de transações:', response.data)
        
        // Extrair os dados do campo 'data' da resposta
        if (response.data && response.data.success) {
          // Usar diretamente os dados da API sem transformação
          this.transactions = response.data.data || []
          console.log('Transações carregadas na store:', this.transactions)
        } else {
          this.transactions = []
        }
      } catch (error) {
        console.error('Erro ao buscar transações:', error)
        this.error = error.response?.data?.message || 'Erro ao buscar transações'
      } finally {
        this.isLoading = false
      }
    },
    
    async fetchDashboardSummary() {
      this.isLoading = true
      
      try {
        // Obter data atual e primeiro dia do mês para o período
        const dataFim = new Date().toISOString().split('T')[0]
        const dataInicio = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
        
        const response = await api.get(`/ResumoFinanceiro?dataInicio=${dataInicio}&dataFim=${dataFim}`)
        this.summary = {
          salesTotal: response.data?.data?.totalReceitas || 0,
          expensesTotal: response.data?.data?.totalDespesas || 0,
          receivableTotal: response.data?.data?.saldoAtual || 0,
          monthlyTotal: response.data?.data?.saldoMensal || 0
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar resumo'
      } finally {
        this.isLoading = false
      }
    },
    
    async createTransaction(transaction) {
      this.isLoading = true
      this.error = null
      
      try {
        // Usar o formato esperado pela API diretamente
        const transactionDTO = {
          descricao: transaction.descricao,
          valor: transaction.valor,
          data: transaction.data,
          tipo: transaction.tipo
        }
        
        console.log('Enviando transação para API:', transactionDTO)
        const response = await api.post('/Transacoes', transactionDTO)
        
        if (response.data && response.data.success) {
          // Adicionar a transação retornada pela API diretamente à lista
          const newTransaction = response.data.data
          this.transactions.push(newTransaction)
          return newTransaction
        } else {
          throw new Error(response.data.message || 'Erro ao criar transação')
        }
      } catch (error) {
        console.error('Erro ao criar transação:', error)
        this.error = error.response?.data?.message || error.message || 'Erro ao criar transação'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async updateTransaction(id, transaction) {
      this.isLoading = true
      this.error = null
      
      try {
        // Usar o formato esperado pela API diretamente
        const transactionDTO = {
          descricao: transaction.descricao,
          valor: transaction.valor,
          data: transaction.data,
          tipo: transaction.tipo
        }
        
        console.log('Atualizando transação na API:', id, transactionDTO)
        const response = await api.put(`/Transacoes/${id}`, transactionDTO)
        
        if (response.data && response.data.success) {
          // Usar a transação retornada pela API diretamente
          const updatedTransaction = response.data.data
          
          // Atualizar a transação na lista
          const index = this.transactions.findIndex(t => t.id === id)
          if (index !== -1) {
            this.transactions[index] = updatedTransaction
          }
          
          return updatedTransaction
        } else {
          throw new Error(response.data.message || 'Erro ao atualizar transação')
        }
      } catch (error) {
        console.error('Erro ao atualizar transação:', error)
        this.error = error.response?.data?.message || error.message || 'Erro ao atualizar transação'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async deleteTransaction(id) {
      this.isLoading = true
      this.error = null
      
      try {
        console.log('Excluindo transação:', id)
        const response = await api.delete(`/Transacoes/${id}`)
        
        if (response.data && response.data.success !== false) {
          this.transactions = this.transactions.filter(t => t.id !== id)
          return true
        } else {
          throw new Error(response.data?.message || 'Erro ao excluir transação')
        }
      } catch (error) {
        console.error('Erro ao excluir transação:', error)
        this.error = error.response?.data?.message || error.message || 'Erro ao excluir transação'
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})
