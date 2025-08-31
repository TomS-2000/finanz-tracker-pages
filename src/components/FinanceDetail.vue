<template>
    <div class="flex flex-col gap-7 sm:ml-5 mr-2">
        <FinanceForm v-if="isFormShow" :closeFinanceForm="closeFinanceForm" :update-data="financeDetail"/>

        <div class="flex justify-between items-center">
            
            <div class="cursor-pointer btn-transition" @click="backToLastPage(false)">
                <CircleArrowLeft class="size-7 sm:size-10"/>
            </div>
            <div class="flex gap-5">
                <div class="cursor-pointer btn-transition" @click="showFinanceUpdateForm">
                    <Pencil class="size-7 sm:size-10"/>
                </div>
                <div class="cursor-pointer btn-transition" @click="deleteFinance">
                    <Trash class="size-7 sm:size-10"/>
                </div>
            </div>
            
        </div>
        
        
        <div class="flex flex-col gap-5 sm:text-2xl">
            
            <div class="sm:text-4xl text-xl font-semibold">
                {{financeDetail?.name }}
            </div>

            <div class="flex gap-2 items-center">
                <span class="font-semibold">
                    {{ t('detailValue') }}:
                </span> 
                <span>{{ financeDetail?.value.toFixed(2) }} €</span>
                <ChevronDown v-show="financeDetail && financeDetail.valueList.length > 0" class="size-5 sm:size-7 btn-transition" @click="toggleIsExtraValuesShow"/>
            </div>

            <Transition
                name = "fade-out"
                enter-active-class="transition-all duration-400 ease-in"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
            >
                <div v-show="financeDetail && financeDetail.valueList.length > 0 && isExtraValuesShow" class="flex flex-col gap-1">
                    <div v-for="(element, index) in financeDetail?.valueList" :key="index" >
                        <div class="flex justify-between border-2 rounded-2xl p-2" 
                        :class="element.value < 0 ? 'bg-gradient-to-b from-red-400 via-red-500 to-red-600' : 'bg-gradient-to-b from-green-400 via-green-500 to-green-600'">
                            <div>{{ element.title }}</div>
                            <div>{{ element.value.toFixed(2) }} €</div>
                        </div>
                    </div>
                </div>
            </Transition>

            <div>
                <span class="font-semibold">
                    {{ t('detailDate') }}:
                </span>
                 {{ state.dateToString(financeDetail?.date ?? '', true) }}
            </div>

            <div v-if="financeDetail?.from">
                <span class="font-semibold">
                    {{ t('detailFrom') }}:
                </span>
                 {{ financeDetail?.from }}
            </div>

            <div v-if="(financeDetail?.categories ?? []).length > 0" class="flex gap-2">
                
                <span class="font-semibold">
                    {{ t('detailCategory') }}:
                </span>
                <div>
                    <div class="flex flex-wrap gap-2">
                        <div v-for="category in financeDetail?.categories" :key="category">
                            <span class="p-1 px-2 rounded-2xl border-1 sm:text-xl" :style="{ backgroundColor: getCategoryColor(category) }">
                                {{ category }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex gap-2.5 items-center">
                <span class="font-semibold"> {{ t('detailStatus') }}:</span>
                <span v-if="financeDetail?.isRecurring"><Clock class=" size-5 sm:size-7"/></span>
                <span v-else><TimerOff class="size-5 sm:size-7"/></span>
                <span v-if="financeDetail?.isNotification"><Bell class="size-5 sm:size-7"/></span>
                <span v-else><BellOff class="size-5 sm:size-7"/></span>
            </div>

            <div v-show="financeDetail?.isRecurring">
                <span class="font-semibold">
                    {{ t('detailAgainCycle') }}:
                </span>
                <span>
                    {{ financeDetail?.recurringCycle ? t(financeDetail?.recurringCycle  as string) : '' }}
                </span>
            </div>

            <div v-show="financeDetail?.isRecurring && !financeDetail?.isNotification && financeDetail?.notificationDate" @click="toggleIsWarningTextShow" class="cursor-pointer">
                <div class="flex gap-2 items-center">
                    <TriangleAlert class="size-5 sm:size-7 text-amber-400 dark:text-amber-300 btn-transition"/>
                    <span class="text-lg">{{ t('detailRecurringNotificationLabel') }}</span>
                </div>
                <span v-show="isWarningTextShow" class="text-base">{{ t('detailRecurringNotificationText') }} </span>
            </div>

            <div v-show="financeDetail?.isNotification">
                <span class="font-semibold">
                    {{ t('detailNotificationDateLabel') }}:
                </span>
                 {{ state.dateToString(financeDetail?.notificationDate ?? '', true) }}
            </div>

            <div v-show="financeDetail?.isNotification" class="flex flex-col gap-2">
                <div class="font-semibold">{{ t('detailNotificationMsgLabel') }}:</div>
                <div>{{ financeDetail?.notificationText }}</div>
            </div>
            
            
            <div v-if="financeDetail?.description" class="flex flex-col gap-2">
                <div class="font-semibold">{{ t('detailDescription') }}:</div>
                <div class="break-words">{{ financeDetail?.description }}</div>
            </div>

        </div>
        
        <NormalButton v-if="!isDeleteAllConfirmationShow" :click="openDeleteAllConfirmation" class="group max-w-fit">
            <div class="sm:text-lg flex gap-1 font-semibold group-hover:text-red-600">
                <Trash></Trash> <span>{{t('formDeleteAllPriceEntriesButton')}}</span>
            </div>
        </NormalButton>

        <div v-else class="flex flex-col gap-2">
            <div class="flex gap-2 items-center sm:text-lg font-semibold text-amber-400 dark:text-amber-300 ">
                <TriangleAlert class="size-5 sm:size-7"/>
                <div>
                    <p>{{t('detailDeleteAllText1')}}</p> 
                    <p>{{t('detailDeleteAllText2')}}</p>
                </div>
                
            </div>
            
            <div class="flex gap-6">
            <NormalButton :click="closeDeleteAllConfirmation" class="max-w-fit">
                <div class="sm:text-lg flex gap-1 font-semibold ">
                    <span>{{t('detailDeleteAllCancelButtonLabel')}}</span>
                </div>
            </NormalButton>
            <NormalButton :click="deleteAllFinanceWithSameName" class="group max-w-fit">
                <div class="sm:text-lg flex gap-1 font-semibold group-hover:text-red-600">
                    <Trash></Trash><span>{{t('detailDeleteAllWithSameNameButtonLabel')}}</span>
                </div>
            </NormalButton>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { useGlobalStore, type Finance } from '@/state';
import { useI18n } from 'vue-i18n';
import { Pencil, Trash, CircleArrowLeft, ChevronDown, BellOff, Bell, Clock, TimerOff, TriangleAlert } from 'lucide-vue-next';
import FinanceForm from './financePage/FinanceForm.vue';
import { previousRoute } from '../main.ts';
import NormalButton from './buttons/NormalButton.vue';

export default {
    components: {
        Pencil,
        Trash,
        CircleArrowLeft,
        ChevronDown,
        BellOff,
        Bell,
        Clock,
        TimerOff,
        TriangleAlert,
        FinanceForm,
        NormalButton
    },

    setup() {
        const state = useGlobalStore();
        const { t } = useI18n();

        return { state, t};
    },

    data() {
        return {
            financeDetail: null as Finance | null,
            isFormShow: false as boolean,
            isExtraValuesShow: false as boolean,
            isWarningTextShow: false as boolean,
            isDeleteAllConfirmationShow: false as boolean,
        }
    },

    methods: {
        closeFinanceForm() {
            this.isFormShow = false;
            const finance = this.state.finances.find(finance => finance.id === parseInt(this.$route.params.id as string));
            this.financeDetail = finance ?? null;
        },

        showFinanceUpdateForm() {
            this.isFormShow = true;
        },

        getCategoryColor(cat: string) {
            const findCategoryColor = this.state.categories.find(category => category.cat === cat)?.color;

            if (findCategoryColor) {
                return findCategoryColor;
            }

            return '';
        },

        deleteFinance() {
            let deleteFinance = this.state.finances.find(finance => finance.id === parseInt(this.$route.params.id as string));
            
            if(deleteFinance) {
                this.state.totalAmount -= this.state.parseToFixed2(deleteFinance.value);
                this.state.totalAmount = this.state.parseToFixed2(this.state.totalAmount);
                this.state.finances = this.state.finances.filter(finance => finance.id !== parseInt(this.$route.params.id as string));
                this.state.checkRemoveFromVisibleList(deleteFinance.date);
            }
            
            this.backToLastPage(true);
        },

        closeDeleteAllConfirmation() {
            this.isDeleteAllConfirmationShow = false;
        },

        openDeleteAllConfirmation() {
            this.isDeleteAllConfirmationShow = true;
        },

        deleteAllFinanceWithSameName() {
            let deleteFinances = this.state.finances.filter(finance => finance.name === this.financeDetail?.name);
            
            this.state.finances = this.state.finances.filter(finance => finance.name !== this.financeDetail?.name);

            for(let i = 0; i < deleteFinances.length; i++) {
                this.state.totalAmount -= this.state.parseToFixed2(deleteFinances[i].value);
                this.state.totalAmount = this.state.parseToFixed2(this.state.totalAmount);
                this.state.checkRemoveFromVisibleList(deleteFinances[i].date);
            }

            this.backToLastPage(true);
        },

        backToLastPage(isDelete: boolean) {
            let backPath = previousRoute?.fullPath ? previousRoute?.fullPath : '/finance';
            
            if(!isDelete) {
                this.$router.push(backPath);
            } else {
                this.$router.replace(backPath);
            }
            
        },

        toggleIsExtraValuesShow() {
            this.isExtraValuesShow = !this.isExtraValuesShow;
        },

        toggleIsWarningTextShow() {
            this.isWarningTextShow = ! this.isWarningTextShow;
        }
    },

    watch: {
        '$route.params.id'(newId) {
            
            const finance = this.state.finances.find(finance => finance.id === parseInt(this.$route.params.id as string));
            if(!finance) {
                this.$router.replace('/not-found');
            } else {
                this.financeDetail = finance ?? null;
            }
        },
    },

    beforeMount() {

        const finance = this.state.finances.find(finance => finance.id === parseInt(this.$route.params.id as string));
        if(!finance) {
                this.$router.replace('/not-found');
        } else {
            this.financeDetail = finance ?? null;
        }
    }
}
</script>
