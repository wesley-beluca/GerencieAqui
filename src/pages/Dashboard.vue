<template>
  <MainLayout>
    <div class="dashboard">
      <!-- Componente de filtro -->
      <FilterPanel 
        title="Filtros do Dashboard" 
        :showTypeFilter="false"
        @filter="applyFilters"
      />
      
      <!-- Cards de resumo -->
      <div class="dashboard-summary">
        <StatCard 
          title="Receitas" 
          :value="summary.salesTotal" 
          icon="pi pi-shopping-cart"
          color="success"
        />
        
        <StatCard 
          title="Despesas" 
          :value="summary.expensesTotal" 
          icon="pi pi-wallet"
          color="danger"
        />
        
        <StatCard 
          title="Saldo" 
          :value="summary.balance" 
          icon="pi pi-dollar"
          color="info"
        />
      </div>
      
      <!-- Gráficos -->
      <div class="dashboard-charts">
        <div class="chart-row">
          <ChartCard 
            title="Receita x Despesa" 
            type="line" 
            :chartData="revenueExpenseData"
            :chartOptions="lineChartOptions"
            class="chart-col-full"
            @export="handleChartExport"
          />
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useTransactionStore } from '../store'
import MainLayout from '../layout/MainLayout.vue'
import StatCard from '../components/atoms/StatCard.vue'
import ChartCard from '../components/molecules/ChartCard.vue'
import FilterPanel from '../components/molecules/FilterPanel.vue'

// Importar CSS separado
import '../assets/styles/dashboard.css'

export default {
  name: 'Dashboard',
  
  components: {
    MainLayout,
    StatCard,
    ChartCard,
    FilterPanel
  },
  
  setup() {
    const transactionStore = useTransactionStore()
    
    // Dados para os cards de resumo
    const summaryData = reactive({
      salesTotal: 0,
      expensesTotal: 0,
      balance: 0
    })
    
    // Dados para o gráfico de barras
    const barChartData = reactive({
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Receitas',
          backgroundColor: '#4CAF50',
          data: [0, 0, 0, 0, 0, 0]
        },
        {
          label: 'Despesas',
          backgroundColor: '#F44336',
          data: [0, 0, 0, 0, 0, 0]
        }
      ]
    })
    
    // Dados para o gráfico de linha
    const lineChartData = reactive({
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [
        {
          label: 'Saldo',
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          tension: 0.4,
          fill: true,
          data: [0, 0, 0, 0, 0, 0]
        }
      ]
    })
    
    // Opções para os gráficos
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    }
    
    // Carregar dados do dashboard
    onMounted(async () => {
      await transactionStore.fetchDashboardSummary()
      await transactionStore.fetchTransactions()
      
      // Atualizar dados de resumo
      Object.assign(summaryData, transactionStore.summary)
      
      // Processar dados para gráficos
      updateChartData()
    })
    
    // Função para atualizar dados dos gráficos
    const updateChartData = () => {
      const transactions = transactionStore.transactions
      if (!transactions || transactions.length === 0) return
      
      // Dados para gráfico de barras - últimos 6 meses
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth()
      
      // Obter os últimos 6 meses
      const last6Months = []
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12
        last6Months.push(months[monthIndex])
      }
      
      // Atualizar labels
      barChartData.labels = last6Months
      lineChartData.labels = last6Months
      
      // Calcular receitas e despesas por mês
      const incomeByMonth = Array(6).fill(0)
      const expenseByMonth = Array(6).fill(0)
      const balanceByMonth = Array(6).fill(0)
      
      transactions.forEach(transaction => {
        const transDate = new Date(transaction.date || transaction.data)
        const transMonth = transDate.getMonth()
        const monthDiff = (currentMonth - transMonth + 12) % 12
        
        if (monthDiff < 6) {
          const monthIndex = 5 - monthDiff
          const value = Number(transaction.value || transaction.valor || 0)
          
          if (transaction.type === 'RECEITA' || transaction.tipo === 1) {
            incomeByMonth[monthIndex] += value
          } else {
            expenseByMonth[monthIndex] += value
          }
        }
      })
      
      // Calcular saldo por mês
      for (let i = 0; i < 6; i++) {
        balanceByMonth[i] = incomeByMonth[i] - expenseByMonth[i]
      }
      
      // Atualizar dados dos gráficos
      barChartData.datasets[0].data = incomeByMonth
      barChartData.datasets[1].data = expenseByMonth
      lineChartData.datasets[0].data = balanceByMonth
      

    }
    
    const applyFilters = (filters) => {
      fetchDashboardData()
    }
    
    // Função para buscar dados do dashboard
    const fetchDashboardData = async () => {
      try {
        // Buscar resumo financeiro do backend
        await transactionStore.fetchDashboardSummary()
        
        // Atualizar cards com os dados do resumo
        summaryData.salesTotal = transactionStore.summary.salesTotal
        summaryData.expensesTotal = transactionStore.summary.expensesTotal
        
        // Calcular o saldo (receitas - despesas)
        summaryData.balance = summaryData.salesTotal - summaryData.expensesTotal
        
        // Buscar transações para atualizar gráficos
        await transactionStore.fetchTransactions()
        
        // Atualizar gráficos com os dados das transações
        updateChartData()
      } catch (error) {
        // Tratamento de erro silencioso
      }
    }
    
    // Opções para gráficos de linha
    const lineChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
    
    // Inicializar dados ao montar o componente
    onMounted(() => {
      fetchDashboardData()
    })
    
    // Função para lidar com a exportação de gráficos
    const handleChartExport = (format) => {
      // Implementação futura para exportação de gráficos
    }
    
    return {
      summary: summaryData,
      revenueExpenseData: barChartData,
      lineChartOptions,
      applyFilters,
      handleChartExport
    }
  }
}
</script>