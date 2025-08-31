<template>
    <div class="flex flex-col gap-5 sm:ml-5 mr-1 font-semibold">
        
        <FinanceForm v-if="isFormShow" :closeFinanceForm="closeFinanceForm" :update-data="updateData"/>
        
        <!-- Filter Bar-->
        <div class="sticky top-1 flex flex-wrap justify-between z-3 gap-1 sm:gap-4 items-center">
            
            <!-- Hinzufügen / Filter -->
            <div class="flex gap-3 sm:gap-4 bg-white/70 dark:bg-gray-800/70 rounded-full p-1">
                <!-- Hinzufügen -->
                <div class="btn-transition cursor-pointer" @click="showFinanceForm">
                    <CirclePlus/>
                </div>

                <!-- Value Filter -->
                <ValueFilter :toggle-filter-show="toggleFilterShow" :is-filter-show="isFilterShow" :value-over="filterData.valueOver"
                :value-under="filterData.valueUnder" :clear-value-filter="clearValueFilter" :set-value-filter-data="setValueFilterData"/>
            </div>
            
            <!-- Filter Tag/Monat/Jahr -->
            <DateTypeFilter :set-date-filter="setDateFilter"/>

            <!-- Filter Suche -->
            <SearchFilter :toggle-search-input-show="toggleSearchInputShow" :is-search-input-show="isSearchInputShow" :search-query="searchQuery" :set-search-query="setSearchQuery"/>
        </div>

        <!-- Main Page (Finanzen) -->
        <div class="flex flex-col gap-3">
            <!-- Date-Finanzen-Section -->
            <div v-for="financeFDP in visibleFinancesPerDate" :key="financeFDP.date" @click="toggleFinanceShow(financeFDP.date)" class="flex flex-col pb-1 gap-2 rounded-3xl border-2 shadow-xl shadow-dark-color cursor-pointer">
                <div class="flex sticky top-12 bg-white/70 dark:bg-gray-800/70 rounded-3xl z-2 p-2 justify-between items-center">
                    <div class="text-lg sm:text-2xl">{{ state.dateToString(financeFDP.date) }}</div>
                    <ChevronDown class="size-8 btn-transition"/>
                </div>
                
                <!-- einzelne Finanzen Section -->
                
                <Transition
                    name = "fade-out"
                    enter-active-class="transition-all duration-400 ease-in"
                    enter-from-class="opacity-0 -translate-y-2"
                    enter-to-class="opacity-100 translate-y-0"
                >
                    <div v-if="showFinance(financeFDP.date)" class="flex flex-col gap-1 px-2 pb-2">
                        <div v-for="finance in financeFDP.finances" :key="finance.id" 
                            class="flex flex-col flex-wrap z-1 gap-1 p-2 border-2 rounded-3xl shadow-md shadow-dark-color" 
                            :class="getFinanceColor(finance.value)" 
                            @click.stop="changeToDetails(finance.id)"
                        >
                            
                            <!-- Finanzen Obere Zeile (Titel, Typ, Preis) -->
                            <div class="flex flex-wrap items-center justify-between">
                                <div class="flex gap-1 items-center sm:text-xl">
                                    {{ finance.name }}
                                    <ChevronDown v-show="finance.valueList.length > 0" class="size-8 cursor-pointer btn-transition" @click.stop="toggleExtraValuesShow(finance.id)"/>
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

                            <!-- Finance Untere Zeile (Datum, Kategorie, Bearbeiten) -->
                            <div class="flex flex-wrap justify-between items-center">
                                <div class="flex flex-wrap items-center gap-3">
                                    <div>{{ state.dateToString(finance.date, true) }}</div>
                                    <div class="flex flex-wrap items-center gap-2">
                                        <div v-for="category in finance.categories" :key="category" class="flex border-1 py-1 px-2 rounded-2xl" :style="{ backgroundColor: getCategoryColor(category) }">
                                            {{ category }}
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

                            <!-- Extra Untergeordnete Preise -->
                            <Transition
                                name = "fade-out"
                                enter-active-class="transition-all duration-400 ease-in"
                                enter-from-class="opacity-0 -translate-y-2"
                                enter-to-class="opacity-100 translate-y-0"
                            >
                                <div v-show="finance.isExtraValuesVisible && finance.valueList.length > 0" class="flex flex-col gap-1 mt-1">
                                    <div v-for="(element, index) in finance.valueList" :key="index" >
                                        <div class="flex justify-between border-2 rounded-2xl p-2" 
                                        :class="element.value < 0 ? 'bg-gradient-to-b from-red-400 via-red-500 to-red-600' : 'bg-gradient-to-b from-green-400 via-green-500 to-green-600'">
                                            <div>{{ element.title }}</div>
                                            <div>{{ element.value.toFixed(2) }} €</div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </Transition>
            </div>
            <div ref="loadMoreTrigger" class="h-2"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { useGlobalStore } from '@/state';
import { useI18n } from 'vue-i18n';
import { CirclePlus, Clock, Bell, Pencil, ChevronDown } from 'lucide-vue-next';
import FinanceForm from './FinanceForm.vue';
import type { Finance, DateTypes } from '@/state';
import InputField from './../inputs/InputField.vue';
import NormalButton from './../buttons/NormalButton.vue';
import ValueFilter from './../financePage/ValueFilter.vue';
import DateTypeFilter from './DateTypeFilter.vue';
import SearchFilter from './SearchFilter.vue';
import { type FinanceDate } from '@/state';

export type FilterData = {
    valueUnder: string,
    valueOver: string
}

export default {
    components: {
        CirclePlus,
        Clock,
        Bell,
        Pencil,
        ChevronDown,
        FinanceForm,
        InputField,
        NormalButton,
        ValueFilter,
        DateTypeFilter,
        SearchFilter
    },
    
    setup() {
        const state = useGlobalStore();
        const { t } = useI18n();

        return { state, t }
    },

    data() {
        return {
            isFormShow: false as boolean,
            isSearchInputShow: false as boolean,
            isFilterShow: false as boolean,
            searchQuery : '' as string,
            filterData: {valueUnder: '', valueOver: ''},
            updateData: null as null | Finance,
            visibleCount: 30,
            observer: null as null | IntersectionObserver,
        }
    },

    methods : {
        // FinanceDate Intersection Observer (verhindert einigermaßen das rendern bzw. anzeigen von großen Datenmengen. Stückelt diese auf)
        setupIntersectionObserver(rootMargin: number) {
            if (this.observer) {
                this.observer.disconnect();
            }

            this.observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && this.state.financePageDateFilter === "day") {
                        this.visibleCount += 30
                    } else if (entries[0].isIntersecting && this.state.financePageDateFilter === "month") {
                        this.visibleCount += 4
                    } else if (entries[0].isIntersecting && this.state.financePageDateFilter === "year") {
                        this.visibleCount += 1
                    }
                },
                { rootMargin: rootMargin + 'px' }
            )
            this.$nextTick(() => {
                if (this.$refs.loadMoreTrigger) {
                    this.observer!.observe(this.$refs.loadMoreTrigger as Element)
                }
            })
        },

        // Sichert ab das genügend Intersection Einträge geladen werden zum Start und bei DateFilter wechsel (Bildschrimgröße) damit Observer Triggern kann
        ensureInitialFill(reset = false) {
            if (reset) {
                this.visibleCount = this.state.financePageDateFilter === 'day' ? 30 :
                                    this.state.financePageDateFilter === 'month' ? 4 :
                                    this.state.financePageDateFilter === 'year' ? 1 : 20;
            }

            this.$nextTick(() => {
                const checkAndExpand = () => {
                    const loadTrigger = this.$refs.loadMoreTrigger as HTMLElement;
                    const containerHeight = document.documentElement.clientHeight;
                    const triggerTop = loadTrigger?.getBoundingClientRect().top ?? 0;

                    if (triggerTop < containerHeight && this.visibleCount < 60) {     // Rekursion beeenden
                        if (this.state.financePageDateFilter === 'day') {
                            this.visibleCount += 30;
                        } else if (this.state.financePageDateFilter === 'month') {
                            this.visibleCount += 4;
                        } else if (this.state.financePageDateFilter === 'year') {
                            this.visibleCount += 1;
                        }

                        this.$nextTick(checkAndExpand);
                    }
                };

                checkAndExpand();
            });
        },

        getFinancesBySearchFilter(finances : FinanceDate[]) : FinanceDate[] {
            if (this.searchQuery && this.searchQuery.length > 0) {
                const query = this.searchQuery.toLowerCase();
                return finances
                .map(fpd => ({
                    ...fpd,
                    finances: fpd.finances.filter(finance =>
                    finance.name.toLowerCase().includes(query) ||
                    finance.valueList.some(vli => vli.title.toLowerCase().includes(query)) ||
                    finance.categories.some(cat => cat.toLowerCase().includes(query)) ||
                    finance.from.toLowerCase().includes(query) ||
                    this.state.dateToString(finance.date).toLowerCase().includes(query)
                    )
                }))
                .filter(fpd => fpd.finances.length > 0) ?? [];
            }
            return finances;
        },

        getFinancesByValueFilter(finances : FinanceDate[]) : FinanceDate[] {
            let valueOver = this.filterData.valueOver ? parseFloat(this.filterData.valueOver) : null;
            let valueUnder = this.filterData.valueUnder ? parseFloat(this.filterData.valueUnder) : null;

            return finances
            .map(fpd => ({
                ...fpd,
                finances: fpd.finances.filter(finance => {
                    if(valueOver !== null && valueUnder !== null) {
                        return finance.value >= valueOver && finance.value <= valueUnder;
                    } else if (valueOver !== null) {
                        return finance.value >= valueOver;
                    } else if (valueUnder !== null) {
                        return finance.value <= valueUnder;
                    }
                    return false;
                })
            }))
            .filter(fpd => fpd.finances.length > 0) ?? [];
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

            this.setObserver();
            
            window.scrollTo({top: 0, behavior: 'auto'});
            this.ensureInitialFill(true);
        },

        // Obverser Root Margin für Jahr anders setzen da zugeklappter einzelner Eintrag kein weiteres sonst nachlädt
        setObserver() {
            if(this.state.financePageDateFilter === 'year') {
                this.setupIntersectionObserver(30);
            } else if (this.state.financePageDateFilter === 'day' || this.state.financePageDateFilter === 'month') {
                this.setupIntersectionObserver(200);
            }
        },

        toggleSearchInputShow() {
            if(this.isSearchInputShow) {
                this.searchQuery = '';
            }
            this.isSearchInputShow = !this.isSearchInputShow;
        },

        setSearchQuery(newQuery: string) {
            this.searchQuery = newQuery;

            window.scrollTo({top: 0, behavior: 'auto'});
            this.ensureInitialFill(true);
        },

        toggleFilterShow() {
            this.isFilterShow = !this.isFilterShow;
        },

        clearValueFilter() {
            this.filterData.valueOver = '';
            this.filterData.valueUnder = '';

            window.scrollTo({top: 0, behavior: 'auto'});
            this.ensureInitialFill(true);
        },

        setValueFilterData(filter: FilterData) {
            this.filterData = {...filter};

            window.scrollTo({top: 0, behavior: 'auto'});
            this.ensureInitialFill(true);
        },

        toggleExtraValuesShow(financeID : number) {
            let financeIndex = this.state.finances.findIndex(f => f.id === financeID);
            if(financeIndex || financeIndex === 0) {
                let finance = this.state.finances[financeIndex];
                if(finance.valueList.length === 0) {
                    finance.isExtraValuesVisible = false;
                }
                
                finance.isExtraValuesVisible = !finance.isExtraValuesVisible;
            }
            
        },

        toggleFinanceShow(date: string) {
            if(this.state.financePageDateFilter === 'day') {
                let isVisibleDay = this.state.isVisibleDayList.find(iv => iv.date === date);
                if(isVisibleDay) {
                    isVisibleDay.isVisible = !isVisibleDay.isVisible;
                }
                
            } else if (this.state.financePageDateFilter === 'month') {
                let isVisibleMonth = this.state.isVisibleMonthList.find(iv => iv.date === date);
                if(isVisibleMonth) {
                    isVisibleMonth.isVisible = !isVisibleMonth.isVisible;
                }

            } else if (this.state.financePageDateFilter === 'year') {
                let isVisibleYear = this.state.isVisibleYearList.find(iv => iv.date === date);
                if(isVisibleYear) {
                    isVisibleYear.isVisible = !isVisibleYear.isVisible;
                }
            }
        },

        showFinance(date: string): boolean {
            if(this.state.financePageDateFilter === "day") {
                return this.state.isVisibleDayList.find(iv => iv.date === date)?.isVisible ?? true;

            } else if (this.state.financePageDateFilter == "month") {
                return this.state.isVisibleMonthList.find(iv => iv.date === date)?.isVisible ?? true;

            } else if (this.state.financePageDateFilter === 'year') {
                return this.state.isVisibleYearList.find(iv => iv.date === date)?.isVisible ?? true;
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

    computed: {
        getFinancesFromDatePart() {

            let financesPerDate: FinanceDate[] = [];
            if (this.state.financePageDateFilter === 'day') {
                financesPerDate = this.state.getFinancesPerDate;
            } else if (this.state.financePageDateFilter === 'month') {
                financesPerDate = this.state.getFinancesPerMonth;
            } else if (this.state.financePageDateFilter === 'year') {
                financesPerDate = this.state.getFinancesPerYear;
            }

            if(this.searchQuery && this.searchQuery.length > 0) {
                financesPerDate = this.getFinancesBySearchFilter(financesPerDate);
            }

            if(this.filterData.valueOver || this.filterData.valueUnder) {
                financesPerDate = this.getFinancesByValueFilter(financesPerDate);
            }

            return financesPerDate;
        },

        visibleFinancesPerDate() {
            return this.getFinancesFromDatePart.slice(0, this.visibleCount);
        },
    },

    mounted() {
        this.setObserver();
        this.ensureInitialFill(true);
    },

    beforeUnmount() {
        if (this.observer && this.$refs.loadMoreTrigger) {
            this.observer.unobserve(this.$refs.loadMoreTrigger as Element);
        }
    },
}
</script>
