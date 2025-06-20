import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// PrimeVue Components
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Chart from 'primevue/chart'
import Card from 'primevue/card'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmationService from 'primevue/confirmationservice'

// Componentes personalizados
import CustomDialog from './components/molecules/CustomDialog.vue'
import ConfirmationDialog from './components/molecules/ConfirmationDialog.vue'

// Configurar localStorage para simular autenticação
localStorage.setItem('token', 'fake-token-for-development')
localStorage.setItem('user', JSON.stringify({
  id: 1,
  name: 'Usuário Teste',
  email: 'usuario@teste.com'
}))

// Criar a aplicação Vue
const app = createApp(App)

// Registrar plugins
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(PrimeVue, { ripple: true })
app.use(ToastService)
app.use(ConfirmationService)

// Inicializar o estado da autenticação
import { useAuthStore } from './store'
const authStore = useAuthStore(pinia)
authStore.user = JSON.parse(localStorage.getItem('user'))
authStore.token = localStorage.getItem('token')

// Registrar componentes globalmente
app.component('Button', Button)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.component('Dropdown', Dropdown)
app.component('Calendar', Calendar)
app.component('Dialog', Dialog)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('TabView', TabView)
app.component('TabPanel', TabPanel)
app.component('Chart', Chart)
app.component('Card', Card)
app.component('Toast', Toast)
app.component('ConfirmDialog', ConfirmDialog)
app.component('CustomDialog', CustomDialog)
app.component('ConfirmationDialog', ConfirmationDialog)

// Montar a aplicação
app.mount('#app')
