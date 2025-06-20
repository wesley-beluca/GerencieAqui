import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// PrimeVue
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// Componentes PrimeVue
import Button from 'primevue/button'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Menu from 'primevue/menu'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'

const app = createApp(App)

// Registrar componentes PrimeVue
app.component('Button', Button)
app.component('Card', Card)
app.component('Chart', Chart)
app.component('Dialog', Dialog)
app.component('Dropdown', Dropdown)
app.component('InputNumber', InputNumber)
app.component('InputText', InputText)
app.component('Menu', Menu)
app.component('Toast', Toast)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)
app.use(ToastService)

app.mount('#app')
