<template>
    <div class="flex divide-x-2 border-2 rounded-2xl sm:text-xl shadow-lg shadow-dark-color cursor-pointer bg-white/50 dark:bg-gray-800/50">
        <div class="py-0.5 px-2 rounded-l-xl" :class="state.financePageDateFilter === 'day' ? 'bg-blue-300/50' : 'hover:bg-cyan-700/60'" @click="setDateFilter('day')">
            {{ t('dayFilter') }}
        </div>
        <div class="py-0.5 px-2" :class="state.financePageDateFilter === 'month' ? 'bg-blue-300/50' : 'hover:bg-cyan-700/60'" @click="setDateFilter('month')">
            {{ t('monthFilter') }}
        </div>
        <div class="py-0.5 px-2 rounded-r-xl" :class="state.financePageDateFilter === 'year' ? 'bg-blue-300/50' : 'hover:bg-cyan-700/60'" @click="setDateFilter('year')">
            {{ t('yearFilter') }}
        </div>
    </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { type DateTypes, useGlobalStore } from '@/state';


export default {
    setup() {
        const state = useGlobalStore();
        const { t } = useI18n();
        return { state, t };
    },

    props: {
        setDateFilter: {
            type: Function as PropType<(filter: DateTypes) => void>,
            required: true
        }
    }
}
</script>