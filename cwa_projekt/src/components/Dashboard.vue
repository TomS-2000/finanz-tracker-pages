<template>
    <div class="flex flex-col gap-2 h-full w-full w-min-0 h-min-0">
        <div class="h-full w-full">
            <LineChart />
        </div>
        
        <div class="flex gap-2 max-sm:flex-wrap max-sm:gap-7 h-full w-full">
            <PieChart />
            <PieChart />    
        </div>
    </div>
</template>

<script lang="ts">
import LineChart from './LineChart.vue';
import PieChart from './PieChart.vue';

export default {
    
    components: {
        LineChart,
        PieChart
    }

}
</script>
