<template>
  <div class="chart-card">
    <div class="chart-card-header">
      <h3 class="chart-card-title">{{ title }}</h3>
      <div class="chart-card-actions">
        <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-rounded" @click="toggleMenu" />
        <Menu ref="menu" :model="menuItems" :popup="true" />
      </div>
    </div>
    <div class="chart-card-body">
      <Chart :type="type" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ChartCard',
  
  props: {
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'line',
      validator: (value) => ['line', 'bar', 'pie', 'doughnut'].includes(value)
    },
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    }
  },
  
  setup(props, { emit }) {
    const menu = ref(null)
    
    const toggleMenu = (event) => {
      menu.value.toggle(event)
    }
    
    const menuItems = [
      {
        label: 'Exportar como PNG',
        icon: 'pi pi-image',
        command: () => emit('export', 'png')
      }
    ]
    
    return {
      menu,
      toggleMenu,
      menuItems
    }
  }
}
</script>

<style scoped>
.chart-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.chart-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-card-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-color);
  margin: 0;
}

.chart-card-body {
  position: relative;
  min-height: 400px;
}
</style> 