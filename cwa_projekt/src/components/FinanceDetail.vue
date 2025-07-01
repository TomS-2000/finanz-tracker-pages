<template>
    <div>
        Detail: {{financeDetail?.name }}
        {{ financeDetail?.date }}
        {{ financeDetail?.from }}
        {{ financeDetail?.value }}
    </div>
</template>

<script lang="ts">
import { useGlobalStore, type Finance } from '@/state';
import { useI18n } from 'vue-i18n';

export default {
    setup() {
        const state = useGlobalStore();
        const { t } = useI18n();

        return { state, t};
    },

    data() {
        return {
            financeDetail: null as Finance | null
        }
    },

    watch: {
        '$route.params.id'(newId) {
            console.log(newId);
            console.log(this.state.nextFinanceId);
            if(newId >= this.state.nextFinanceId) {
                this.$router.replace('/not-found');
            } else {
                const finance = this.state.finances.find(finance => finance.id === parseInt(this.$route.params.id as string));
                this.financeDetail = finance ?? null;
            }
        }
    },

    beforeMount() {

        if(parseInt(this.$route.params.id as string) >= this.state.nextFinanceId) {
                this.$router.replace('/not-found');
        } else {
            const finance = this.state.finances.find(finance => finance.id === parseInt(this.$route.params.id as string));
            this.financeDetail = finance ?? null;
        }
    }
}
</script>

<style lang="">
    
</style>