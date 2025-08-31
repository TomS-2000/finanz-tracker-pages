import './assets/main.css'
import { createWebHashHistory, createRouter, type RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'
import Dashboard from './components/dashboard/Dashboard.vue'
import FinancePage from './components/financePage/FinancePage.vue'
import FinanceDetail from './components/FinanceDetail.vue'
import Setting from './components/Settings.vue'
import NotFound from './components/NotFound.vue'
import Info from './components/Info.vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { translation } from './translations/translation'
import LineChart from './components/dashboard/LineChart.vue'
import PieChart from './components/dashboard/PieChart.vue'
import { useGlobalStore } from './state'

const routes = [
    {path: '/', component: Dashboard},
    {path: '/dashboard', component: Dashboard},
    {path:'/finance', component: FinancePage},
    {path:'/finance/:id', component: FinanceDetail},
    {path:'/info', component: Info},
    {path:'/settings', component: Setting},
    {path:'/line-chart', component: LineChart},
    {path:'/pie-chart', component: PieChart},
    {path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);

const state = useGlobalStore();

export let previousRoute: RouteLocationNormalizedLoadedGeneric | null = null;
router.beforeEach((to, from, next) => {
  previousRoute = from;

  if(['/finance', '/dashboard', '/', '/line-chart', '/pie-chart'].some(path => to.fullPath.includes(path))) {
    state.checkNotification();
    state.checkRecurringFinances();
  }
  
  next();
});

app.use(router).use(translation).mount('#app');
