<template>
    <div class="flex flex-col h-full font-semibold">
        <div class="text-2xl sm:text-4xl sm:ml-10">{{ t('settings') }}</div>
        <div class="flex flex-col items-center justify-center gap-8 text-lg mt-8">
            
            <SliderButton :click="state.toggleDarkMode" :change-attribute="state.isDark || false" first-color="bg-white dark:bg-gray-900" second-color="bg-white dark:bg-gray-900">
                <template v-slot:firstText><span>{{ t('light') }}</span></template>
                <template v-slot:secondText><span>{{ t('dark') }}</span></template>
                <template v-slot:specialIcons>
                        <Moon v-if="state.isDark" class="w-4 h-4 text-yellow-500" />
                        <Sun v-else class="w-4 h-4 text-yellow-500" />
                </template>
            </SliderButton>

            <SliderButton :click="state.toggleLanguage" :change-attribute="locale === 'de'" first-color="bg-white dark:bg-gray-900" second-color="bg-white dark:bg-gray-900">
                <template v-slot:firstText><span>English</span></template>
                <template v-slot:secondText><span>Deutsch</span></template>
            </SliderButton>

            <div class="flex flex-wrap items-center gap-4 text-sm sm:text-base bg-gray-100 dark:bg-gray-600 p-3 mr-1 rounded-xl shadow-md shadow-dark-color">
                <span>{{ t('totalAmountLabel') }} </span>
                
                <InputField v-model="inputAmount" input-type="number" placeholder="" :is-uppercase="false" special-style="flex gap-1">€</InputField>

                <NormalButton :click="setTotalAmount"><CircleArrowDown/></NormalButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useGlobalStore } from '@/state';
import { Moon } from 'lucide-vue-next';
import { Sun } from 'lucide-vue-next';
import { CircleArrowDown } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import NormalButton from './buttons/NormalButton.vue';
import InputField from './inputs/InputField.vue';
import SliderButton from './buttons/SliderButton.vue';

export default {
    components: {
        Moon,
        Sun,
        CircleArrowDown,
        NormalButton,
        InputField,
        SliderButton
    },

    setup() {
        const state = useGlobalStore();
        const { t, locale } = useI18n();
        return { state, t, locale }
    },

    data() {
        return {
            inputAmount: "" as string 
        }
    },

    methods: {
        setTotalAmount() {
            this.state.setTotalAmount(this.inputAmount)
        },
    }
}
</script>

<style lang="">
    
</style>