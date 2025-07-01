<template>
    <div class="flex flex-col gap-5 sm:ml-5 mr-2 font-semibold">
        
        <FinanceForm v-if="isFormShow" :closeFinanceForm="closeFinanceForm" :update-data="updateData"/>
        
        <!-- Filter Bar-->
        <div class="sticky top-1 flex justify-between z-2 gap-3 sm:gap-4 items-center">
            
            <div class="flex gap-3 sm:gap-4 bg-white/50 dark:bg-gray-800/50 rounded-full p-1">
                <div class="btn-transition cursor-pointer" @click="showFinanceForm">
                    <CirclePlus/>
                </div>
                <div>
                    <Funnel class="btn-transition cursor-pointer"/>
                </div>
            </div>
            
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

            <div class="btn-transition cursor-pointer bg-white/50 dark:bg-gray-800/50 rounded-full p-1">
                <Search/>
            </div>
        </div>

        <!-- Main Page -->
        <div class="flex flex-col gap-3">
            <!-- Date-Finance-Section -->
            <div v-for="financeFDP in getFinancesFromDatePart()" :key="financeFDP.date" @click="toggleFinanceShow(financeFDP.date)" class="flex flex-col gap-2 p-2 rounded-3xl border-2 shadow-xl shadow-dark-color cursor-pointer">
                <div class="flex justify-between items-center">
                    <div class="text-lg sm:text-2xl">{{ dateToString(financeFDP.date) }}</div>
                    <ChevronDown class="size-8"/>
                </div>
                
                <!-- Finance-Section -->
                
                <Transition
                    name = "fade-out"
                    enter-active-class="transition-all duration-400 ease-in"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                >
                    <div v-show="showFinance(financeFDP.date)" class="flex flex-col gap-1">
                        <div v-for="finance in financeFDP.finances" :key="finance.id" 
                            class="flex flex-col flex-wrap z-1 gap-1 p-2 border-2 rounded-3xl shadow-md shadow-dark-color" 
                            :class="getFinanceColor(finance.value)" 
                            @click.stop="changeToDetails(finance.id)"
                        >
                            
                            <!-- Finance-Top-Row -->
                            <div class="flex flex-wrap items-center justify-between">
                                <div class="sm:text-xl">
                                    {{ finance.name }}
                                </div>
                                <div class="flex gap-3 sm:text-lg">
                                    <div>
                                        {{ finance.from }}
                                    </div>
                                    <div>
                                        {{ finance.value.toFixed(2) + " €" }}
                                    </div>
                                </div>
                            </div>
                            <!-- Finance-Bottom-Row -->
                            <div class="flex flex-wrap justify-between items-center">
                                <div class="flex flex-wrap items-center gap-3">
                                    <div>{{ dateToString(finance.date, true) }}</div>
                                    <div class="flex flex-wrap items-center gap-2">
                                        <div v-for="category in finance.categories" :key="category.cat" class="flex border-1 py-1 px-2 rounded-2xl" :style="{ backgroundColor: getCategoryColor(category.cat) }">
                                            {{ category.cat }}
                                        </div>
                                        <div v-if="finance.isRecurring">
                                            <Clock/>
                                        </div>
                                        <div v-if="finance.isNotification">
                                            <Bell/>
                                        </div>
                                    </div>
                                </div>
                                <div class="btn-transition" @click.stop="showFinanceUpdateForm(finance)">
                                    <Pencil />
                                </div>
                            </div>
                        
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useGlobalStore } from '@/state';
import { useI18n } from 'vue-i18n';
import { CirclePlus } from 'lucide-vue-next';
import { Funnel } from 'lucide-vue-next';
import { Search } from 'lucide-vue-next';
import { Clock } from 'lucide-vue-next';
import { Bell } from 'lucide-vue-next';
import { Pencil } from 'lucide-vue-next';
import { ChevronDown } from 'lucide-vue-next';
import FinanceForm from './FinanceForm.vue';
import { RouterLink } from 'vue-router';
import type { Finance } from '@/state';

type FinanceDate = {
    date : string,
    finances: Finance[]
}

type DateTypes = "day" | "month" | "year";

export default {
    components: {
        CirclePlus,
        Funnel,
        Search,
        Clock,
        Bell,
        Pencil,
        ChevronDown,
        FinanceForm
    },
    
    setup() {
        const state = useGlobalStore();
        const { t } = useI18n();
        return { state, t }
    },

    data() {
        return {
            isFormShow: false as boolean,
            updateData: null as null | Finance
        }
    },

    methods : {
        parseDate(str: string) {
            return new Date(str).getTime();
        },
        
        dateToString(str: string, isDay? : boolean) {
            if(this.state.financePageDateFilter === "day" || isDay) {
                const [year, month, day] = str.split('-');
                return `${day}.${month}.${year}`;
            } else if (this.state.financePageDateFilter === "month") {
                const [year, month, day] = str.split('-');
                return `${month}.${year}`;
            } else if (this.state.financePageDateFilter === "year") {
                const [year, month, day] = str.split('-');
                return `${year}`;
            } else {
                return "";
            } 
        },

        getFinancesFromDatePart() {
            if(this.state.financePageDateFilter === 'day') {
                return this.state.getFinancesPerDate;
            } else if (this.state.financePageDateFilter === 'month') {
                return this.state.getFinancesPerMonth;
            } else if (this.state.financePageDateFilter === 'year') {
                return this.state.getFinancesPerYear;
            } else {
                return [];
            }
        },

        getFinanceColor(value: number) {
            if(value < 0) {
                return 'bg-red-300/50';
            } else if (value > 0) {
                return 'bg-green-300/50';
            } 
            return '';
        },

        setDateFilter(dateType : DateTypes) {
            this.state.financePageDateFilter = dateType;
        },

        toggleFinanceShow(date: string) {
            if(this.state.financePageDateFilter === 'day') {
                this.state.finances = this.state.finances.map((finance) => finance.date === date ? { ...finance, isVisibleByDay: !finance.isVisibleByDay }: finance);
            } else if (this.state.financePageDateFilter === 'month') {
                const [year, month, day] = date.split('-');

                this.state.finances = this.state.finances.map(finance => {
                    const [yearf, monthf, dayf] = finance.date.split('-');
                    
                    if(yearf === year && monthf === month) {
                        return { ...finance, isVisibleByMonth: !finance.isVisibleByMonth };
                    }
                    return finance;
                } );

            } else if (this.state.financePageDateFilter === 'year') {
                const [year, month, day] = date.split('-');

                this.state.finances = this.state.finances.map(finance => {
                    const [yearf, monthf, dayf] = finance.date.split('-');
                    
                    if(yearf === year) {
                        return { ...finance, isVisibleByYear: !finance.isVisibleByYear };
                    }
                    return finance;
                } );
            } else {
                return [];
            }
        },

        showFinance(date: string): boolean {

            if(this.state.financePageDateFilter === "day" && this.state.finances.every(finance => (finance.date === date && finance.isVisibleByDay) || finance.date !== date)) {
                return true;
            } else if (this.state.financePageDateFilter == "month") {
                const [year, month] = date.split('-');

                const isShow = this.state.finances.every(finance => {
                    const [yearf, monthf] = finance.date.split('-');
                    
                    if((yearf === year && monthf === month && finance.isVisibleByMonth) || (yearf !== year || monthf !== month)) {
                        return true;
                    }
                    return false;
                } );

                return isShow;

            } else if (this.state.financePageDateFilter === 'year') {
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

        showFinanceForm() {
            this.updateData = null;
            this.isFormShow = true;
        },

        showFinanceUpdateForm(data : Finance) {
            this.updateData = data;
            this.isFormShow = true;
        },

        closeFinanceForm() {
            this.isFormShow = false;
        },

        changeToDetails(financeID : number) {
            this.$router.push(`/finance/${financeID}`);
        },

        getCategoryColor(cat: string) {
            const findCategoryColor = this.state.categories.find(category => category.cat === cat)?.color;

            if (findCategoryColor) {
                return findCategoryColor;
            }

            return '';
        }
    },

    computed : {
           
    }
}
</script>

<style lang="">
    
</style>