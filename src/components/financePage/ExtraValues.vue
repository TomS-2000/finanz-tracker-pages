<template>
    <div class="border-1 rounded-2xl p-1 mt-1">
        <div v-for="(vli, index) in valueList" :key="index">
            <div class="flex flex-wrap gap-1 justify-between items-center border-1 rounded-2xl mt-1 p-1">
                
                <div class="flex gap-1 items-center pl-1">
                    <span>{{ t('formPriceEntryTitleLabel') }}:</span>
                    <InputField v-model="vli.title" :class="{ 'border-red-500': checkInvalid(index, 'title')}" input-type="text" :is-uppercase="false" :max-length="50" :is-disabled="false"/>
                </div>
                
                <div class="flex gap-1 items-center pl-1">
                    <span>{{ t('formPriceEntryPriceLabel') }}:</span>
                    <NumberInputField class="w-25" :class="{ 'border-red-500': checkInvalid(index, 'value')}" v-model="vli.value" :is-uppercase="false" :max-value="maxValue" :min-value="minValue" :is-disabled="false"/>
                </div>

                <NormalButton class="group" :click="() => deleteValueListEntry(index)">
                    <Trash class="size-5 group-hover:text-red-600"/>
                </NormalButton>
            </div>
        </div>
        <div class="flex flex-wrap gap-2 p-1 pt-2">
            <NormalButton class="w-fit" :click="addInitialEntryToList" >
                <div class="flex gap-2 items-center">
                    <CirclePlus class="size-5"/>
                    {{ t('formAddPriceEntryButton') }}
                </div>
               
            </NormalButton>
            <NormalButton class="w-fit group" :click="deleteAllEntries" >
                <div class="flex gap-2 items-center group-hover:text-red-600">
                    <Trash class="size-5"/>
                    {{ t('formDeleteAllPriceEntriesButton') }}
                </div>
            </NormalButton>
        </div>
    </div>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import NormalButton from './../buttons/NormalButton.vue';
import { Trash, CirclePlus } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import NumberInputField from '../inputs/NumberInputField.vue';
import InputField from '../inputs/InputField.vue';

export default {
    components: {
        InputField,
        NumberInputField,
        NormalButton,
        Trash,
        CirclePlus
    },

    setup() {
        const { t } = useI18n();
        return { t };
    },

    data() {
        return{
            minValue: -100000000000,
            maxValue: 100000000000,
        }
    },

    props: {
        valueList: {
            type: Object as PropType<{ title: string, value: string }[]>,
            required: true
        },

        invalideList: {
            type: Object as PropType<{index: number, type: string}[]>,
            required: true
        },

        addInitialEntryToList: {
            type: Function as PropType<() => void>,
            required: true
        },

        deleteValueListEntry: {
            type: Function as PropType<(index: number) => void>,
            required: true
        },

        deleteAllEntries: {
            type: Function as PropType<() => void>,
            required: true
        }
    },

    methods: {
        checkInvalid(index: number, type: 'title' | 'value') : boolean {
            return this.invalideList.some(ili => ili.index === index && (ili.type === 'both' || ili.type === type));
        }
    }

}
</script>