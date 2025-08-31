<template>
    <div>
        <Funnel class="btn-transition cursor-pointer" @click="toggleFilterShow"/>
        <div v-show="isFilterShow" class="relative">
            <div class="flex flex-col gap-2 absolute top-3 p-2 border-1 rounded-xl bg-white/90 dark:bg-gray-800/90 sm:w-95 w-50">
                <div class="flex flex-wrap gap-2 justify-between items-center">
                    <span>{{ t('valueOverFilter') }}:</span>
                    <InputField v-model="localValueOver" input-type="number" :is-uppercase="false" :is-disabled="false"/>
                </div>
                <div class="flex flex-wrap gap-2 justify-between items-center">
                    <span> {{ t('valueUnderFilter') }}:</span>
                    <InputField v-model="localValueUnder" input-type="number" :is-uppercase="false" :is-disabled="false"/>
                </div>
                <FunnelX class="btn-transition cursor-pointer" @click="clearValueFilter"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Funnel, FunnelX } from 'lucide-vue-next';
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { type FilterData } from './FinancePage.vue';
import InputField from '../inputs/InputField.vue';

export default {
    components: {
        Funnel,
        FunnelX,
        InputField
    },

    setup() {
        const { t } = useI18n();
        return { t };
    },

    data() {
        return {
            localValueOver : this.valueOver,
            localValueUnder : this.valueUnder
        }
    },

    props: {
        toggleFilterShow: {
            type: Function as PropType<()=>void>,
            required: true
        },

        isFilterShow: {
            type: Boolean,
            required: true
        },

        valueOver: {
            type: String,
            required: true
        },

        valueUnder: {
            type: String,
            required: true
        },

        clearValueFilter: {
            type: Function as PropType<()=>void>,
            required: true
        },

        setValueFilterData: {
            type: Function as PropType<(filter: FilterData) => void>,
            required: true
        }
    },

    watch: {
        localValueOver(newValue) {
            this.setValueFilterData({valueOver: newValue, valueUnder: this.localValueUnder});
        },

        localValueUnder(newValue) {
            this.setValueFilterData({valueOver: this.localValueOver, valueUnder: newValue});
        },

        valueOver(newValue) {
            this.localValueOver = newValue;
        },

        valueUnder(newValue) {
            this.localValueUnder = newValue;
        }
    }
}
</script>