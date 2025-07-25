import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// PrimeVue Components - Apenas os utilizados nas telas principais
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import Chart from 'primevue/chart'
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'

// Componentes personalizados
import CustomDialog from './components/molecules/CustomDialog.vue'
import ConfirmationDialog from './components/molecules/ConfirmationDialog.vue'

// Criar a aplicação Vue
const app = createApp(App)

// Registrar plugins
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(PrimeVue, { ripple: true })
app.use(ToastService)
app.use(ConfirmationService)

// Importar store de autenticação
import { useAuthStore } from './store'

// Inicializar o estado da autenticação
const authStore = useAuthStore(pinia)
authStore.initAuth()

// Registrar componentes globalmente
app.component('Button', Button)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('Dropdown', Dropdown)
app.component('Calendar', Calendar)
app.component('Dialog', Dialog)
app.component('Chart', Chart)
app.component('Card', Card)
app.component('Toast', Toast)
app.component('ConfirmDialog', ConfirmDialog)
app.component('CustomDialog', CustomDialog)
app.component('ConfirmationDialog', ConfirmationDialog)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Tag', Tag)

// Montar a aplicação
app.mount('#app')
