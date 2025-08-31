<template>
    <div class="flex flex-1 flex-col gap-1 border-2 rounded-2xl pr-2 p-1 shadow-xl shadow-dark-color min-h-0 h-fit max-h-full">
        <div class="sm:text-xl font-semibold pl-1">{{ t('infoTabLabel') }}</div>
        
        <div class="flex flex-col gap-2 p-1 w-full overflow-y-auto">
            
            <div class="flex flex-wrap gap-1 border-2 rounded-2xl p-2 shadow-xl shadow-dark-color bg-gray-300 dark:bg-gray-600">
                <span class="text-xl font-semibold">{{ t('infoTabTotalAmountLabel') }}:</span>
                <span class="text-xl text-nowrap">{{ state.totalAmount.toFixed(2) }} €</span>
            </div>

            <FinanceTabTransaction transaction-type="expense"/>
            <FinanceTabTransaction transaction-type="revenue"/>
            <FinanceTabTransaction transaction-type="next"/>
        </div>
    </div>
    
</template>

<script lang="ts">
import { useGlobalStore, type Finance } from '@/state';
import { useI18n } from 'vue-i18n';
import FinanceTabTransaction from './FinanceTabTransaction.vue';

export default {
    components: {
        FinanceTabTransaction
    },

    setup() {
        const state = useGlobalStore();
        const { t } = useI18n();

        return {state , t };
    },
}
</script>