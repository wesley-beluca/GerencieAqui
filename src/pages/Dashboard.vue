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
    
    // Função para atualizar apenas os gráficos com base nas transações filtradas
    // Não modifica os valores dos cards que vem do backend
    const updateChartDataOnly = () => {
      const transactions = transactionStore.transactions
      if (!transactions || transactions.length === 0) {
        // Se não houver transações, zerar os dados dos gráficos
        barChartData.datasets[0].data = Array(6).fill(0)
        barChartData.datasets[1].data = Array(6).fill(0)
        lineChartData.datasets[0].data = Array(6).fill(0)
        return
      }
      
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
        
        // Calcular valores para os gráficos
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
      // Usar os filtros de data inicial e final para buscar dados
      fetchDashboardData(filters.dataInicio, filters.dataFim)
    }
    
    // Função para buscar dados do dashboard
    const fetchDashboardData = async (dataInicio = null, dataFim = null) => {
      try {
        // Buscar resumo financeiro do backend com os filtros de data
        await transactionStore.fetchDashboardSummary(dataInicio, dataFim)
        
        // Atualizar cards com os dados do resumo financeiro do backend
        // Usar exatamente os campos retornados pela API
        summaryData.salesTotal = transactionStore.summary.totalReceitas
        summaryData.expensesTotal = transactionStore.summary.totalDespesas
        
        // Calcular o saldo como a diferença entre receitas e despesas
        summaryData.balance = transactionStore.summary.totalReceitas - transactionStore.summary.totalDespesas
        
        // Buscar transações para atualizar gráficos com os mesmos filtros de data
        await transactionStore.fetchTransactions(dataInicio, dataFim)
        
        // Atualizar apenas os gráficos com os dados das transações
        updateChartDataOnly()
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error)
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
    
    // Função para atualizar dados dos gráficos e cards com base nas transações
    const updateChartData = () => {
      const transactions = transactionStore.transactions
      if (!transactions || transactions.length === 0) {
        // Se não houver transações, zerar os valores
        summaryData.salesTotal = 0
        summaryData.expensesTotal = 0
        summaryData.balance = 0
        
        // Zerar dados dos gráficos
        barChartData.datasets[0].data = Array(6).fill(0)
        barChartData.datasets[1].data = Array(6).fill(0)
        lineChartData.datasets[0].data = Array(6).fill(0)
        return
      }
      
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
      
      // Variáveis para calcular os totais para os cards
      let totalReceitas = 0
      let totalDespesas = 0
      
      transactions.forEach(transaction => {
        const transDate = new Date(transaction.date || transaction.data)
        const transMonth = transDate.getMonth()
        const monthDiff = (currentMonth - transMonth + 12) % 12
        const value = Number(transaction.value || transaction.valor || 0)
        
        // Calcular totais para os cards
        if (transaction.type === 'RECEITA' || transaction.tipo === 1) {
          totalReceitas += value
        } else {
          totalDespesas += value
        }
        
        // Calcular valores para os gráficos
        if (monthDiff < 6) {
          const monthIndex = 5 - monthDiff
          
          if (transaction.type === 'RECEITA' || transaction.tipo === 1) {
            incomeByMonth[monthIndex] += value
          } else {
            expenseByMonth[monthIndex] += value
          }
        }
      })
      
      // Atualizar os cards com os totais calculados
      summaryData.salesTotal = totalReceitas
      summaryData.expensesTotal = totalDespesas
      summaryData.balance = totalReceitas - totalDespesas
      
      // Calcular saldo por mês
      for (let i = 0; i < 6; i++) {
        balanceByMonth[i] = incomeByMonth[i] - expenseByMonth[i]
      }
      
      // Atualizar dados dos gráficos
      barChartData.datasets[0].data = incomeByMonth
      barChartData.datasets[1].data = expenseByMonth
      lineChartData.datasets[0].data = balanceByMonth
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