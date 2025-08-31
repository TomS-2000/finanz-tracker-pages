<template>
    <div v-if="transaction" class="flex flex-col w-full cursor-pointer border-2 rounded-2xl p-2 shadow-xl shadow-dark-color" 
    :class="getFinanceColor(transaction.value)" 
    @click="toFinanceDetail(transaction.id)">
        <div class="flex flex-wrap gap-1">
            <span class="font-semibold">{{ t(getTransactionLabel(transactionType)) }}:</span>
            <span>{{ transaction.value.toFixed(2) }} €</span>
            
        </div>
        <span>{{ transaction.name }}</span>
        <span class="text-sm self-end">{{ state.dateToString(transaction.date, true) }}</span>
    </div>
    <div v-else class="border-2 rounded-2xl p-2 shadow-xl shadow-dark-color bg-gray-300 dark:bg-gray-600">
        {{ t(getTransactionLabel(transactionType)) }}: {{ t('infoTabNotFoundText') }}
    </div>
</template>

<script lang="ts">
import { useGlobalStore, type Finance } from '@/state';
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';

type TransactionType = 'expense' | 'revenue' | 'next';

export default {
    setup() {
        const state = useGlobalStore();
        const { t } = useI18n();

        return { state , t };
    },

    props: {
        transactionType: {
            type: String as PropType<TransactionType>,
            required: true
        },
    },

    methods: {
        getFinanceColor(value: number) {
            if(value < 0) {
                return 'bg-red-300/50';
            } else if (value > 0) {
                return 'bg-green-300/50';
            } else {
                return 'bg-gray-300 dark:bg-gray-600'
            }
        },

        toFinanceDetail(fromID : number) {
            this.$router.push(`/finance/${fromID}`);
        },

        getTransaction(transaction: TransactionType) {
            if(transaction === 'expense') {
                return this.getLastExpense;
            } else if (transaction === 'revenue') {
                return this.getLastRevenue;
            } else if (transaction === 'next') {
                return this.getNextFinance;
            }

            return null;
        },

        getTransactionLabel(transaction: TransactionType) {
            if(transaction === 'expense') {
                return 'infoTabExpenseLabel';
            } else if (transaction === 'revenue') {
                return 'infoTabRevenueLabel';
            } else if (transaction === 'next') {
                return 'infoTabNextTransaction';
            }

            return '';
        }
    },

    computed: {
        transaction(): Finance | null {
            return this.getTransaction(this.transactionType);
        },

        getLastExpense() : Finance | null {
            let now = new Date();
            
            let lastFinance: Finance[] = this.state.finances
            .filter(f => f.value < 0 && new Date(f.date) <= now)
            .sort(
                (f1, f2) => {return f2.date.localeCompare(f1.date)}
            ) ?? [];

            if(lastFinance.length > 0) {
                return lastFinance[0];
            }

            return null;
        },

        getLastRevenue() : Finance | null {
            let now = new Date();
            
            let lastFinance: Finance[] = this.state.finances
            .filter(f => f.value > 0 && new Date(f.date) <= now)
            .sort(
                (f1, f2) => {return f2.date.localeCompare(f1.date)}
            ) ?? [];

            if(lastFinance.length > 0) {
                return lastFinance[0];
            }

            return null;
        },

        getNextFinance() : Finance | null {
            let now = new Date();
            
            
            let finances: Finance[] = this.state.finances
                .filter(f => f.isRecurring)
                .map(f => (
                    {...f, date: this.state.toLocalISOString(
                        this.state.getNextRecurringDate(
                            new Date(f.date), f.recurringCycle, parseInt(f.date.split(/[-T]/)[2])
                        )
                    )}
                ));

            finances = [...finances, ...this.state.finances];

            let lastFinance: Finance[] = finances
            .filter(f => new Date(f.date) > now)
            .sort(
                (f1, f2) => {return f1.date.localeCompare(f2.date)}
            ) ?? [];

            if(lastFinance.length > 0) {
                return lastFinance[0];
            }

            return null;
        }
    }
}
</script>