<template>
<div class="flex flex-col items-center min-w-0 w-full h-full">
	<div class="flex flex-wrap items-center gap-3">
		
		<!-- Finanzen Typ Ausgaben/Einnhamen Select -->
		<SelectAbsolute 
			:toggle-filter-options="toggleFinanceTypeFilterOptions" 
			:filter-options-open="financeTypeFilterOptionsOpen" 
			:filter-options="financeTypeFilterOptions" 
			:filter="financeTypeFilter"
			:is-filter-translation="true"
			:change-filter="changeFinanceTypeFilter"
			filter-label="chartTypeChooseFilter"
			:top-width="'w-35'"
			:bottom-width="'w-[103%]'"
		/>

		<!-- Zwischen Label -->
		<div class="sm:text-xl sm:font-bold">
			{{ t('pieChartChooseFilterLabel') }}
		</div>

		<!-- Monat/Jahr Select -->
		<SelectAbsolute 
			:toggle-filter-options="toggleFilterOptions" 
			:filter-options-open="dateFilterOptionsOpen" 
			:filter-options="state.getDateFilterOptions" 
			:filter="state.pieChartDateFilter"
			:is-filter-translation="false"
			:change-filter="changeFilter"
			filter-label='chartChooseFilter'
			:top-width="'w-30'"
			:bottom-width="'w-[103.5%]'"
		/>

		<slot></slot>

		<!-- Diagramm Infotext -->
		<div class="flex gap-1 cursor-pointer items-center" @click="toggleInfoText()">
			<Info class="size-7 btn-transition"/>
			<div v-show="state.isPieChartInfoVisible" class="max-sm:text-xs ">
				{{ t('pieChartInfoText') }}
			</div>	
		</div>

	</div>
	
	<!-- Donut Diagramm -->
	<div class="w-full h-full min-w-0 p-2">
		<Doughnut v-if="isChartShown" :data="getChartData" :options="getChartOptions" />
		<div class="w-full h-full sm:text-3xl mt-3" v-else>{{ t('noDataText') }} {{ t(financeTypeFilter) }} : {{ state.pieChartDateFilter }}</div>
	</div>
</div>
</template>

<script lang="ts">
import { Doughnut } from 'vue-chartjs'
import { useGlobalStore, type FinanceDate } from '@/state';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale} from 'chart.js'
import { useI18n } from 'vue-i18n';
import { ChevronDown, Info } from 'lucide-vue-next';
import SelectAbsolute from './../dropdownSelect/SelectAbsolute.vue';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

export default {
	name: 'LineChart',
	components: { 
		Doughnut,
		ChevronDown,
		Info,
		SelectAbsolute
	 },

	setup() {
		const state = useGlobalStore();
		const { t } = useI18n();
		
		return { state, t}
	},

	data() {
		return {
			dateFilterOptionsOpen: false as boolean,
			financeTypeFilter: 'expenses' as string,
			financeTypeFilterOptions: ['expenses', 'revenues'] as string[],
			financeTypeFilterOptionsOpen: false as boolean,
		}
	},

	methods: {

		changeFilter(filter: string) {
			this.state.pieChartDateFilter = filter;
			this.toggleFilterOptions();
		},

		toggleFilterOptions() {
			this.dateFilterOptionsOpen = !this.dateFilterOptionsOpen;
		},

		changeFinanceTypeFilter(filter: string) {
			this.financeTypeFilter = filter;
			this.toggleFinanceTypeFilterOptions();
		},

		toggleFinanceTypeFilterOptions() {
			this.financeTypeFilterOptionsOpen = !this.financeTypeFilterOptionsOpen;
		},

		toggleInfoText() {
			this.state.isPieChartInfoVisible = !this.state.isPieChartInfoVisible;
		},

	},

    computed: {

		isChartShown() : boolean {
			return !this.getChartData.datasets[0].data.every(d => d === 0);
		},

        getChartData() {

			const [year, month] = this.state.pieChartDateFilter.split(/[-T]/);
			let categories = this.state.categories.map(cat => cat.cat);
			let colors = this.state.categories.map(cat => cat.color);
			let expensesPerCategory = Array.from({length: categories.length}, () => 0);

			let financesForSearchedDate : FinanceDate[] = []; 

			if(month && year) {
				financesForSearchedDate = this.state.getFinancesPerMonth.filter(finance => finance.date === this.state.pieChartDateFilter);
			}
			else if (year) {
				financesForSearchedDate = this.state.getFinancesPerYear.filter(finance => finance.date === this.state.pieChartDateFilter);
			}

			if(financesForSearchedDate[0]){

				let fFSD = financesForSearchedDate[0].finances;
				let data: number[][] = Array.from({length: categories.length}, () => []);

				for(let i = 0; i < categories.length; i++) {
					
					for(let j = 0; j < fFSD.length; j++) {

						let isFilterValue = false;
						if(this.financeTypeFilter === 'revenues') {
							isFilterValue = fFSD[j].value > 0;
						} else if(this.financeTypeFilter === 'expenses') {
							isFilterValue = fFSD[j].value < 0;
						} 
						
						if(isFilterValue && fFSD[j].categories.includes(categories[i])) {
							let newValue = fFSD[j].value / fFSD[j].categories.length;
							data[i].push(newValue);
						}
					}
					
				}

				for(let i = 0; i < expensesPerCategory.length; i++) {
					expensesPerCategory[i] = this.state.parseToFixed2(data[i].reduce((sum, value) => sum + value, 0)) ?? 0;
				}
			}

			// sinnlose Kategorien entferen
			categories = categories.filter((_,i) => expensesPerCategory[i] !== 0);
			colors = colors.filter((_,i) => expensesPerCategory[i] !== 0);
			expensesPerCategory = expensesPerCategory.filter(epc => epc !== 0);
			
			return {
				labels: categories,
				datasets: [
					{
						label: 'Ausgaben pro Kategorie',
						data: expensesPerCategory,
                        backgroundColor: colors,
						fill: false,
						//borderColor: 'rgb(75, 192, 250 ,0)',
						tension: 0.1,
						hoverOffset: 20
					}
				]
			} 
        },

		getChartOptions() {
			const color = this.state.isDark ? '#f7fafc' : '#1a202c';

			const chartOptions =  {
				responsive: true,
				maintainAspectRatio: false,
				layout: {
					padding: 20
				},
				plugins: {
					legend: {
						labels: {
							color: color,
							font: {
								size: 16
							},
						}
					}
				}
			}

			return chartOptions;
		}
    }
}
</script>
