<template>
  <MainLayout>
    <div class="transactions-page">
      <div class="content-wrapper">
        <div class="page-header">
          <div></div>
          <Button label="Nova Transação" icon="pi pi-plus" @click="openNewTransactionDialog" />
        </div>

        <div class="transaction-card card">
          <DataTable 
            :value="transactions" 
            :loading="isLoading"
            stripedRows
            paginator 
            :rows="10" 
            :rowsPerPageOptions="[5, 10, 20, 50]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} transações"
            responsiveLayout="scroll"
            class="p-datatable-sm p-datatable-gridlines transaction-table"
            :scrollable="true"
            scrollHeight="flex"
          >
            <Column field="descricao" header="Descrição" sortable />
            <Column field="tipo" header="Tipo" sortable>
              <template #body="slotProps">
                <Tag 
                  :value="slotProps.data.tipo === 1 ? 'Receita' : 'Despesa'" 
                  :severity="slotProps.data.tipo === 1 ? 'success' : 'danger'" 
                  class="transaction-tag"
                />
              </template>
            </Column>
            <Column field="data" header="Data" sortable>
              <template #body="slotProps">
                {{ formatDate(slotProps.data.data) }}
              </template>
            </Column>
            <Column field="valor" header="Valor" sortable>
              <template #body="slotProps">
                <span :class="{ 'text-green-500': slotProps.data.tipo === 1, 'text-red-500': slotProps.data.tipo === 0 }">
                  {{ formatCurrency(slotProps.data.valor) }}
                </span>
              </template>
            </Column>
            <Column header="Ações">
              <template #body="slotProps">
                <div class="flex gap-3">
                  <Button icon="pi pi-pencil" class="p-button-text p-button-sm" @click="editTransaction(slotProps.data)" />
                  <Button icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" @click="confirmDelete(slotProps.data)" />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>

        <!-- Dialog para nova transação -->
        <CustomDialog 
          v-model="transactionDialog" 
          :header="dialogTitle" 
          confirmLabel="Salvar"
          :confirmButtonClass="'p-button-success'"
          @cancel="hideDialog"
          @confirm="saveTransaction"
          class="transaction-dialog"
        >
          <div class="field">
            <label for="descricao">Descrição</label>
            <InputText id="descricao" v-model="transaction.descricao" required autofocus />
          </div>

          <div class="field">
            <label for="tipo">Tipo</label>
            <Dropdown 
              id="tipo" 
              v-model="transaction.tipo" 
              :options="tiposTransacao" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="Selecione o tipo"
            />
          </div>

          <div class="field">
            <label for="data">Data</label>
            <Calendar id="data" v-model="transaction.data" dateFormat="dd/mm/yy" />
          </div>

          <div class="field">
            <label for="valor">Valor</label>
            <InputNumber id="valor" v-model="transaction.valor" mode="currency" currency="BRL" locale="pt-BR" />
          </div>
        </CustomDialog>

        <!-- Dialog de confirmação de exclusão -->
        <ConfirmationDialog 
          v-model="deleteDialog" 
          header="Confirmar exclusão" 
          message="Tem certeza que deseja excluir esta transação?"
          type="danger"
          confirmLabel="Sim"
          cancelLabel="Não"
          confirmButtonClass="p-button-danger"
          @cancel="deleteDialog = false"
          @confirm="deleteSelectedTransaction"
        />

        <!-- Toast para mensagens -->
        <Toast />
      </div>
    </div>
  </MainLayout>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useTransactionStore } from '../store'
import { useToast } from 'primevue/usetoast'
import MainLayout from '../layout/MainLayout.vue'
import '../assets/styles/transacoes.css'

export default {
  name: 'TransacoesPage',
  components: {
    MainLayout
  },

  setup() {
    const toast = useToast()
    const transactionStore = useTransactionStore()
    
    const transactions = ref([])
    const isLoading = ref(false)
    const transactionDialog = ref(false)
    const deleteDialog = ref(false)
    const transaction = ref(getEmptyTransaction())
    const selectedTransaction = ref(null)
    
    const tiposTransacao = [
      { label: 'Despesa', value: 0 },
      { label: 'Receita', value: 1 }
    ]

    const dialogTitle = computed(() => {
      return transaction.value.id ? 'Editar Transação' : 'Nova Transação'
    })

    function getEmptyTransaction() {
      return {
        tipo: 0,
        data: new Date(),
        descricao: '',
        valor: 0
      }
    }

    function formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('pt-BR').format(date)
    }

    function formatCurrency(value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value)
    }

    async function loadTransactions() {
      isLoading.value = true
      try {
        await transactionStore.fetchTransactions()
        transactions.value = transactionStore.transactions
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar as transações', life: 3000 })
      } finally {
        isLoading.value = false
      }
    }

    function openNewTransactionDialog() {
      transaction.value = getEmptyTransaction()
      transactionDialog.value = true
    }

    function editTransaction(data) {
      // Cria uma cópia dos dados
      const transactionData = { ...data }
      
      // Converte a string de data para objeto Date se for uma string
      if (typeof transactionData.data === 'string') {
        transactionData.data = new Date(transactionData.data)
      }
      
      transaction.value = transactionData
      transactionDialog.value = true
    }

    function hideDialog() {
      transactionDialog.value = false
    }

    async function saveTransaction() {
      isLoading.value = true
      
      try {
        if (transaction.value.id) {
          // Atualizar transação existente
          await transactionStore.updateTransaction(transaction.value.id, transaction.value)
          toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Transação atualizada', life: 3000 })
        } else {
          // Criar nova transação
          await transactionStore.createTransaction(transaction.value)
          toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Transação criada', life: 3000 })
        }
        
        transactionDialog.value = false
        await loadTransactions()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: error.message || 'Erro ao salvar transação', life: 3000 })
      } finally {
        isLoading.value = false
      }
    }

    function confirmDelete(data) {
      selectedTransaction.value = data
      deleteDialog.value = true
    }

    async function deleteSelectedTransaction() {
      isLoading.value = true
      
      try {
        await transactionStore.deleteTransaction(selectedTransaction.value.id)
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Transação excluída', life: 3000 })
        deleteDialog.value = false
        selectedTransaction.value = null
        await loadTransactions()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir transação', life: 3000 })
      } finally {
        isLoading.value = false
      }
    }

    onMounted(() => {
      loadTransactions()
    })

    return {
      transactions,
      isLoading,
      transaction,
      transactionDialog,
      deleteDialog,
      tiposTransacao,
      dialogTitle,
      formatDate,
      formatCurrency,
      openNewTransactionDialog,
      editTransaction,
      hideDialog,
      saveTransaction,
      confirmDelete,
      deleteSelectedTransaction
    }
  }
}
</script>