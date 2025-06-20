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
        .sort((a, b) => new Date(b.data) - new Date(a.data))
        .slice(0, 5)
    },
    
    incomeTransactions: (state) => {
      return state.transactions.filter(t => t.tipo === 1)
    },
    
    expenseTransactions: (state) => {
      return state.transactions.filter(t => t.tipo === 0)
    }
  },
  
  actions: {
    async fetchTransactions() {
      this.isLoading = true
      this.error = null
      
      try {
        const response = await api.get('/Transacoes')

        if (response.data && response.data.success) {
          this.transactions = response.data.data || []
        } else {
          this.transactions = []
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao buscar transações'
      } finally {
        this.isLoading = false
      }
    },
    
    async fetchDashboardSummary() {
      this.isLoading = true
      
      try {
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
        // Formatar a data para enviar apenas a data sem o horário
        let formattedDate = null
        if (transaction.data) {
          const date = new Date(transaction.data)
          formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T00:00:00`
        }
        
        const transactionDTO = {
          descricao: transaction.descricao,
          valor: transaction.valor,
          data: formattedDate,
          tipo: transaction.tipo
        }
        
        const response = await api.post('/Transacoes', transactionDTO)
        
        if (response.data && response.data.success) {
          const newTransaction = response.data.data
          this.transactions.push(newTransaction)
          return newTransaction
        } else {
          throw new Error(response.data.message || 'Erro ao criar transação')
        }
      } catch (error) {
        // O erro será lançado para ser tratado pelo componente
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
        // Formatar a data para enviar apenas a data sem o horário
        let formattedDate = null
        if (transaction.data) {
          const date = new Date(transaction.data)
          formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T00:00:00`
        }
        
        const transactionDTO = {
          descricao: transaction.descricao,
          valor: transaction.valor,
          data: formattedDate,
          tipo: transaction.tipo
        }
        
        const response = await api.put(`/Transacoes/${id}`, transactionDTO)
        
        if (response.data && response.data.success) {
          const updatedTransaction = response.data.data
          
          const index = this.transactions.findIndex(t => t.id === id)
          if (index !== -1) {
            this.transactions[index] = updatedTransaction
          }
          
          return updatedTransaction
        } else {
          throw new Error(response.data.message || 'Erro ao atualizar transação')
        }
      } catch (error) {
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
        const response = await api.delete(`/Transacoes/${id}`)
        
        if (response.data && response.data.success !== false) {
          this.transactions = this.transactions.filter(t => t.id !== id)
          return true
        } else {
          throw new Error(response.data?.message || 'Erro ao excluir transação')
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Erro ao excluir transação'
        throw error
      } finally {
        this.isLoading = false
      }
    }
  }
})
