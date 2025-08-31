<template>
    <div class="flex flex-col gap-2 h-full w-full min-h-60">
        <div class="flex-1 min-h-20 w-full">
            <LineChart>
                <RouterLink title="Open Line-Chart" class="btn-transition" to="/line-chart">
                    <ChartLine/>
                </RouterLink>
            </LineChart>
        </div>
        
        <div class="flex flex-1 max-sm:flex-col sm:flex-wrap gap-2 max-sm:gap-4 min-h-30 w-full pb-2">
            <FinanceTab class="max-sm:min-h-72"/>
            <NotificationTab class="max-sm:min-h-70"/>
            
            <PieChart class="flex-1 min-w-80">
                <RouterLink title="Open Pie-Chart" class="btn-transition" to="/pie-chart">
                    <ChartPie/>
                </RouterLink>
            </PieChart>    
        </div>
    </div>
</template>

<script lang="ts">
import LineChart from './LineChart.vue';
import PieChart from './PieChart.vue';
import { ChartLine, ChartPie } from 'lucide-vue-next';
import NotificationTab from './NotificationTab.vue';
import FinanceTab from './FinanceTab.vue';

export default {
    
    components: {
        LineChart,
        PieChart,
        NotificationTab,
        FinanceTab,
        ChartLine,
        ChartPie,
    }

}
</script>
