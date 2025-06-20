<template>
  <div class="stat-card" :class="colorClass">
    <div class="stat-card-content">
      <h3 class="stat-card-title">{{ title }}</h3>
      <div class="stat-card-value">{{ formattedValue }}</div>
    </div>
    <div class="stat-card-icon">
      <i :class="icon"></i>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'StatCard',
  
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    color: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'success', 'danger', 'info', 'warning'].includes(value)
    },
    icon: {
      type: String,
      default: 'pi pi-chart-bar'
    },
    currency: {
      type: Boolean,
      default: true
    }
  },
  
  setup(props) {
    const colorClass = computed(() => {
      return `stat-card-${props.color}`
    })
    
    const formattedValue = computed(() => {
      if (props.currency) {
        return new Intl.NumberFormat('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        }).format(props.value)
      }
      
      return props.value
    })
    
    return {
      colorClass,
      formattedValue
    }
  }
}
</script>

<style scoped>
.stat-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-radius: 8px;
  color: var(--header-color);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-card-content {
  display: flex;
  flex-direction: column;
}

.stat-card-title {
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.9;
  text-transform: uppercase;
}

.stat-card-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

.stat-card-icon {
  font-size: 2.5rem;
  opacity: 0.8;
}

.stat-card-primary {
  background-color: var(--primary-color);
}

.stat-card-success {
  background-color: var(--success-color);
}

.stat-card-danger {
  background-color: var(--danger-color);
}

.stat-card-info {
  background-color: var(--info-color);
}

.stat-card-warning {
  background-color: var(--warning-color);
}
</style> 