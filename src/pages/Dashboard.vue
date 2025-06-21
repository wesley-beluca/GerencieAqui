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
            type="pie" 
            :chartData="pieChartData"
            :chartOptions="pieChartOptions"
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
    
    // Dados para o gráfico de pizza
    const pieChartData = reactive({
      labels: ['Receitas', 'Despesas'],
      datasets: [
        {
          backgroundColor: ['#4CAF50', '#F44336'],
          hoverBackgroundColor: ['#66BB6A', '#EF5350'],
          borderColor: '#ffffff',
          borderWidth: 2,
          data: [0, 0]
        }
      ]
    })
    
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
        // Se não houver transações, zerar os dados do gráfico
        pieChartData.datasets[0].data = [0, 0]
        return
      }
      
      // Variáveis para calcular os totais para o gráfico de pizza
      let totalReceitas = 0
      let totalDespesas = 0
      
      transactions.forEach(transaction => {
        const value = Number(transaction.value || transaction.valor || 0)
        
        // Calcular totais para o gráfico de pizza
        if (transaction.type === 'RECEITA' || transaction.tipo === 1) {
          totalReceitas += value
        } else {
          totalDespesas += value
        }
      })
      
      // Atualizar dados do gráfico de pizza
      pieChartData.datasets[0].data = [totalReceitas, totalDespesas]
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
    
    // Opções para gráficos de pizza
    const pieChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '0%', // Sem recorte para gráfico de pizza cheio
      radius: '90%', // Aumenta o raio do gráfico para ocupar mais espaço
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: 'var(--text-color)',
            font: {
              size: 14 // Aumenta o tamanho da fonte da legenda
            },
            padding: 20 // Aumenta o espaçamento da legenda
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
              return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`;
            }
          },
          bodyFont: {
            size: 14 // Aumenta o tamanho da fonte do tooltip
          }
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
        
        // Zerar dados do gráfico
        pieChartData.datasets[0].data = [0, 0]
        return
      }
      
      // Variáveis para calcular os totais para o gráfico de pizza e cards
      let totalReceitas = 0
      let totalDespesas = 0
      
      transactions.forEach(transaction => {
        const value = Number(transaction.value || transaction.valor || 0)
        
        // Calcular totais para os cards
        if (transaction.type === 'RECEITA' || transaction.tipo === 1) {
          totalReceitas += value
        } else {
          totalDespesas += value
        }
      })
      
      // Atualizar os cards com os totais calculados
      summaryData.salesTotal = totalReceitas
      summaryData.expensesTotal = totalDespesas
      summaryData.balance = totalReceitas - totalDespesas
      
      // Atualizar dados do gráfico de pizza
      pieChartData.datasets[0].data = [totalReceitas, totalDespesas]
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
      pieChartData,
      pieChartOptions,
      applyFilters,
      handleChartExport
    }
  }
}
</script>

<style scoped>
/* Estilos específicos do dashboard */
.chart-row {
  min-height: 450px;
}

.chart-col-full {
  display: flex;
  flex-direction: column;
}

/* Aumenta o tamanho do gráfico de pizza */
:deep(.p-chart) {
  height: 400px !important;
  width: 100% !important;
  margin: 0 auto;
}
</style>
