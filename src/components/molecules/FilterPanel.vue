<template>
  <div class="filter-panel">
    <div class="filter-header">
      <h3 class="filter-title">{{ title }}</h3>
      <Button 
        icon="pi pi-filter" 
        class="p-button-outlined p-button-sm p-2" 
        @click="toggleFilters" 
      />
    </div>
    
    <div v-if="showFilters" class="filter-content">
      <div class="filter-form">
        <div class="filter-row">
          <!-- Período - Data Inicial -->
          <div class="filter-field">
            <label>Data Inicial</label>
            <div class="p-inputgroup">
              <Calendar 
                v-model="filters.dataInicio" 
                dateFormat="dd/mm/yy"
                placeholder="Data inicial" 
                class="w-full"
              />
              <Button 
                icon="pi pi-calendar" 
                class="p-button-outlined p-2" 
              />
            </div>
          </div>
          
          <!-- Período - Data Final -->
          <div class="filter-field">
            <label>Data Final</label>
            <div class="p-inputgroup">
              <Calendar 
                v-model="filters.dataFim" 
                dateFormat="dd/mm/yy"
                placeholder="Data final" 
                class="w-full"
              />
              <Button 
                icon="pi pi-calendar" 
                class="p-button-outlined p-2" 
              />
            </div>
          </div>
          
          <!-- Tipo -->
          <div class="filter-field" v-if="showTypeFilter">
            <label>Tipo</label>
            <Dropdown 
              v-model="filters.type" 
              :options="typeOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="Selecione o tipo"
              class="w-full"
            />
          </div>
          
          <!-- Campo de categoria removido -->
        </div>
        
        <div class="filter-actions">
          <Button 
            label="Limpar" 
            icon="pi pi-times" 
            class="p-button-outlined p-button-danger p-2" 
            @click="resetFilters" 
          />
          <Button 
            label="Aplicar" 
            icon="pi pi-check" 
            class="p-button-success p-2" 
            @click="applyFilters" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'

export default {
  name: 'FilterPanel',
  
  props: {
    title: {
      type: String,
      default: 'Filtros'
    },
    showTypeFilter: {
      type: Boolean,
      default: true
    }
    // showCategoryFilter removido
  },
  
  setup(props, { emit }) {
    const showFilters = ref(false)
    
    // Opções de tipo
    const typeOptions = [
      { label: 'Todos', value: null },
      { label: 'Receitas', value: 1 },
      { label: 'Despesas', value: 0 }
    ]
    
    // Estado dos filtros
    const filters = reactive({
      dataInicio: null,
      dataFim: null,
      type: null
    })
    
    // Mostrar/ocultar filtros
    const toggleFilters = () => {
      showFilters.value = !showFilters.value
    }
    
    // Limpar filtros
    const resetFilters = () => {
      filters.dataInicio = null;
      filters.dataFim = null;
      filters.type = null;
      emit('filter', { ...filters })
    }
    
    // Aplicar filtros
    const applyFilters = () => {
      emit('filter', { ...filters })
    }
    
    return {
      showFilters,
      filters,
      typeOptions,
      toggleFilters,
      resetFilters,
      applyFilters
    }
  }
}
</script>

<style>
.filter-panel {
  background-color: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.filter-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
}

.filter-content {
  padding: 1rem;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-field {
  flex: 1;
  min-width: 200px;
  margin-right: 10px;
}

.filter-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .filter-field {
    flex: 1 0 100%;
  }
}
</style>
