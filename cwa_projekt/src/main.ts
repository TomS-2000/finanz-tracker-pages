import './assets/main.css'
import { createWebHashHistory, createRouter } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'
import Dashboard from './components/Dashboard.vue'
import FinancePage from './components/FinancePage.vue'
import NotificationPage from './components/NotificationPage.vue'
import FinanceDetail from './components/FinanceDetail.vue'
import Setting from './components/Settings.vue'
import NotFound from './components/NotFound.vue'
import Info from './components/Info.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { translation } from './translations/translation'
import LineChart from './components/LineChart.vue'
import PieChart from './components/PieChart.vue'

const routes = [
    {path: '/', component: Dashboard},
    {path: '/dashboard', component: Dashboard},
    {path:'/finance', component: FinancePage},
    {path:'/finance/:id', component: FinanceDetail},
    {path:'/notification', component: NotificationPage},
    {path:'/info', component: Info},
    {path:'/settings', component: Setting},
    {path:'/line-chart', component: LineChart},
    {path:'/pie-chart', component: PieChart},
    {path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound},
]

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

createApp(App).use(router).use(pinia).use(translation).mount('#app')
