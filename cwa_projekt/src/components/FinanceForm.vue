<template>
    <div class="fixed top-0 left-0 flex justify-center items-center min-w-0 min-h-0 w-screen h-screen bg-gray-600/30 dark:bg-gray-100/30 z-3">
        <div class="w-[80vw] theme-colors p-3 rounded-2xl shadow-xl shadow-dark-color">
            <div class="flex flex-col gap-4">
                
                <div class="flex justify-between">
                    <div class="sm:text-4xl">{{ t('formNewEntryLabel') }}</div>
                    <div class="cursor-pointer btn-transition" @click="closeFinanceForm()">
                        <CircleX class="sm:size-10 "/>
                    </div>
                </div>

                <div class="flex flex-wrap justify-around py-4 gap-3 max-h-[calc(80vh-8rem)] overflow-y-auto">
                    
                    <div class="flex flex-col flex-1 gap-4">
                        <div class="flex flex-col">
                            <div>
                                {{ t('formTitleLabel') }}
                            </div>
                            <InputField v-model="formData.name" input-type="text" :is-uppercase="false"/>
                        </div>

                        <div class="flex flex-col gap-3 border-1 p-2 rounded-2xl">
                            <div class="flex justify-between items-center cursor-pointer" @click="toggleIsCategoryOpen">
                                <div v-if="formData.categories.every(category => !category.checked)">
                                    {{ t('formCategoryLabel') }}
                                </div>
                                <div v-else class="flex flex-wrap gap-2">
                                    <div  v-for="category in getCheckedCategories">
                                        <span class="p-1 px-2 rounded-2xl border-1" :style="{ backgroundColor: category.color }">
                                            {{ category.cat }}
                                        </span>
                                    </div>
                                </div>
                                
                                <div><ChevronDown/></div>
                            </div>
                        
                            <Transition
                                name = "fade-out"
                                enter-active-class="transition-all duration-400 ease-in"
                                enter-from-class="opacity-0 -translate-y-2"
                                enter-to-class="opacity-100 translate-y-0"
                            >
                                <div v-show="isCategoryOpen" class="flex flex-col gap-1">
                                    <div v-for="category in formData.categories" class="flex justify-between gap-3 items-center">
                                        <div class="flex gap-3 pl-1">
                                            <input type="checkbox" :checked="category.checked" @change="changeCategoryChecked(category.cat)">
                                            <span>{{ category.cat }}</span>
                                        </div>
                                           
                                        <input type="color" class="rounded-full w-10" :value="category.color" @change="(e) => changeCategoryColor(category.cat, (e.target as HTMLInputElement).value)">    
                                    </div>
                                    <div class="flex gap-3 items-center" @click="">
                                        <CirclePlus class="size-5"/> {{ t('formNewCategoryLabel') }}
                                    </div>
                                </div>
                            </Transition>
                        </div>
                        
                        <div class="flex flex-col">
                            <div>
                                {{ t('formDateLabel') }}
                            </div>
                        <InputField v-model="formData.date" input-type="date" :is-uppercase="true"/>
                        </div>

                        <SliderButton :click="toggleAgain" :change-attribute="formData.isRecurring" first-color="bg-green-600" second-color="bg-white dark:bg-gray-900">
                            <template v-slot:firstText><span>{{ t('formAgainLabel') }}</span></template>
                        </SliderButton>
                            
                        <SliderButton :click="toggleNotification" :change-attribute="formData.isNotification" first-color="bg-green-600" second-color="bg-white dark:bg-gray-900">
                            <template v-slot:firstText><span>{{ t('formNotificationLabel') }}</span></template>
                        </SliderButton>
                        

                        <template v-if="formData.isNotification">
                            <div class="flex flex-col">
                                <div>
                                    {{ t('formNotificationDateLabel') }}
                                </div>
                                <InputField v-model="formData.notificationDate" input-type="date" :is-uppercase="true"/>
                            </div>
                        </template>

                        <template v-if="formData.isNotification">
                            <div class="flex flex-col">
                                <div>
                                    {{ t('formNotificationMsgLabel') }}
                                </div>
                                <TextAreaField v-model="formData.notificationText"/>
                            </div>
                        </template>
                    </div>

                    <div class="flex flex-col flex-1 gap-4">
                        <div class="flex flex-col">
                            <div>
                                {{ t('formPriceLabel') }}
                            </div>
                            <InputField v-model="formData.value" input-type="number" :is-uppercase="false" special-style="flex gap-1">
                                <ChevronDown/>
                            </InputField>
                        </div>
                        
                        <div class="flex flex-col">
                            <div>
                                {{ t('formDecriptionLabel') }}
                            </div>
                            <TextAreaField v-model="formData.description" :min-width="40"/>
                        </div>
                    </div>
                </div>

                <NormalButton :click="addFormData" class="self-center text-2xl">
                    <span v-if="isUpdate">{{ t('formUpdateButtonLabel') }}</span>
                    <span v-else>{{ t('formAddButtonLabel') }}</span>
                </NormalButton>
                
            </div>     
        </div>     
    </div>
</template>

<script lang="ts">
import { CircleX } from 'lucide-vue-next';
import { ChevronDown } from 'lucide-vue-next';
import { CirclePlus } from 'lucide-vue-next';
import InputField from './inputs/InputField.vue';
import TextAreaField from './inputs/TextAreaField.vue';
import SliderButton from './buttons/SliderButton.vue';
import NormalButton from './buttons/NormalButton.vue';
import { useI18n } from 'vue-i18n';
import { useGlobalStore } from '@/state';
import type { PropType } from 'vue';
import type { Finance } from '@/state';

type FormData = {
    id: number,
    name: string,
    value: number | "",
    from: string,
    categories: {cat: string, color: string, checked: boolean}[]
    date: string,
    description: string
    isRecurring: boolean,
    isNotification: boolean,
    notificationDate: string,
    notificationText: string
}

export default {
    components: {
        CircleX,
        ChevronDown,
        CirclePlus,
        InputField,
        TextAreaField,
        SliderButton,
        NormalButton
    },

    setup() {
        const state = useGlobalStore();
        const {t} = useI18n();
        return {state, t};
    },

    data() {
        return {
            formData: {
                id: -1 as number,
                name: '' as string,
                value: '' as number | '',
                from: 'Konto',
                date: '' as string,
                categories: [] as {cat: string, color: string, checked: boolean}[],
                description: '' as string,
                isRecurring: false,
                isNotification: false,
                notificationDate: '' as string,
                notificationText: '' as string,
            } as FormData,
            isCategoryOpen: false as boolean,
            isUpdate: false as boolean
        }
    },

    props: {
        closeFinanceForm: {
            type: Function,
            required: true
        },

        updateData: {
            type: Object as PropType<Finance | null>
        }
    },

    methods: {
        toggleAgain() {
            this.formData.isRecurring = !this.formData.isRecurring;
        },

        toggleNotification() {
            this.formData.isNotification = !this.formData.isNotification;
        },

        toggleIsCategoryOpen() {
            this.isCategoryOpen = !this.isCategoryOpen;
        },

        changeCategoryChecked(cat: string) {
            this.formData.categories = this.formData.categories.map(category => category.cat === cat ? {...category, checked:!category.checked} : category);
        },

        changeCategoryColor(cat: string, color: string) {
            this.formData.categories = this.formData.categories.map(category => category.cat === cat ? {...category, color: color} : category);
        },

        showFinance(date: string, dateFilter: 'day' | 'month' | 'year'): boolean {

            if(dateFilter === "day" && this.state.finances.every(finance => (finance.date === date && finance.isVisibleByDay) || finance.date !== date)) {
                return true;
            } else if (dateFilter == "month") {
                const [year, month] = date.split('-');

                const isShow = this.state.finances.every(finance => {
                    const [yearf, monthf] = finance.date.split('-');
                    
                    if((yearf === year && monthf === month && finance.isVisibleByMonth) || (yearf !== year || monthf !== month)) {
                        return true;
                    }
                    return false;
                } );

                return isShow;

            } else if (dateFilter === 'year') {
                const [year] = date.split('-');

                const isShow = this.state.finances.every(finance => {
                    const [yearf] = finance.date.split('-');
                    
                    if((yearf === year && finance.isVisibleByYear) || (yearf !== year)) {
                        return true;
                    }
                    return false;
                } );

                return isShow;
            }
            return false;
        },

        addFormData() {
            if(this.formData.value && this.formData.date && this.formData.name) {

                this.state.categories = this.formData.categories.map(category => ({cat: category.cat, color: category.color}));

                const financeObj: Finance = {
                    id: this.isUpdate ? this.formData.id : this.state.nextFinanceId,
                    name: this.formData.name,
                    value: Number(this.formData.value),
                    from: this.formData.from,
                    date: this.formData.date,
                    categories: this.formData.categories
                        .filter(category => category.checked)
                        .map(category => ({ cat: category.cat })),
                    description: this.formData.description,
                    isRecurring: this.formData.isRecurring,
                    isNotification: this.formData.isNotification,
                    notificationDate: this.formData.notificationDate,
                    notificationText: this.formData.notificationText,
                    isVisibleByDay: this.showFinance(this.formData.date, 'day'),
                    isVisibleByMonth: this.showFinance(this.formData.date, 'month'),
                    isVisibleByYear: this.showFinance(this.formData.date, 'year')
                } 

                console.log(this.formData);

                // Update
                if(this.isUpdate && this.updateData) {
                    this.state.finances = this.state.finances.map(finance => finance.id === financeObj.id ? financeObj : finance);
                    this.state.totalAmount += Number(this.formData.value) - this.updateData.value;
                // Add
                } else {
                    this.state.finances = [...this.state.finances, financeObj];
                    this.state.totalAmount += Number(this.formData.value);
                    this.formData.id = this.state.nextFinanceId;
                    this.state.nextFinanceId++;
                }
                
                this.closeFinanceForm();
            }
        }
    },

    computed: {
        getCheckedCategories() : {cat: string, color: string}[]{
            return this.formData.categories.filter(category => category.checked);
        }
    },

    beforeMount() {

        if(this.updateData) {
            this.formData = {
                id: this.updateData.id,
                name: this.updateData.name,
                value: this.updateData.value,
                from: this.updateData.from,
                date: this.updateData.date,
                categories: this.state.categories.map((category: {cat: string, color: string}) => {
                    const found = this.updateData?.categories.find((c: {cat: string}) => c.cat === category.cat);
                    return { ...category, checked: !!found };
                }),
                description: this.updateData.description,
                isRecurring: this.updateData.isRecurring,
                isNotification: this.updateData.isNotification,
                notificationDate: this.updateData.notificationDate,
                notificationText: this.updateData.notificationText,
            }

            this.isUpdate = true;
        } else {

            this.formData.categories = this.state.categories.map((category: {cat: string, color: string}) => {
                return { ...category, checked: false };
            });

            this.isUpdate = false;
        }

        
    }
}
</script>

<style lang="">
    
</style>