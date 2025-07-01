<template>
<div class="flex flex-col min-w-0 w-full h-full">
	<div class="flex flex-wrap items-center gap-3">
		<div class="relative border-1 w-35 p-1 pl-2 rounded-2xl sm:font-semibold cursor-pointer" :class="financeTypeFilterOptionsOpen ? 'border-b-0 rounded-t-2xl rounded-b-none border-2' : ''">
			<div @click="toggleFinanceTypeFilterOptions" class="flex justify-between">
				<div v-if="financeTypeFilter">
					{{ t(financeTypeFilter) }}
				</div>
				<div v-else>
					{{ t('chartTypeChooseFilter') }}
				</div>
				<div>
					<ChevronDown/>
				</div>
			</div>
			
			<Transition
				name = "fade-out"
				enter-active-class="transition-all duration-400 ease-in"
				enter-from-class="opacity-0 -translate-y-1"
				enter-to-class="opacity-100 translate-y-0"
			>
				<div v-show="financeTypeFilterOptionsOpen" class="absolute top-8 -left-0.5 z-3 px-1 pt-1 border-2 rounded-b-2xl w-[103%] theme-colors">
					<div v-for="filter in financeTypeFilterOptions" :key="filter" @click="changeFinanceTypeFilter(filter)" class="p-1 pl-2 hover:hover:bg-cyan-700/60 btn-transition last:rounded-b-2xl" >
						<span>{{ t(filter) }}</span>
					</div>
				</div>
			</Transition>
		</div>

		<div class="sm:text-xl sm:font-bold">
			{{ t('pieChartChooseFilterLabel') }}
		</div>

		<div class="relative border-1 w-30 p-1 pl-2 rounded-2xl sm:font-semibold cursor-pointer" :class="dateFilterOptionsOpen ? 'border-b-0 rounded-t-2xl rounded-b-none border-2' : ''">
			<div @click="toggleFilterOptions" class="flex justify-between">
				<div v-if="dateFilter">
					{{ dateFilter }}
				</div>
				<div v-else>
					{{ t('chartChooseFilter') }}
				</div>
				<div>
					<ChevronDown/>
				</div>
			</div>
			
			<Transition
				name = "fade-out"
				enter-active-class="transition-all duration-400 ease-in"
				enter-from-class="opacity-0 -translate-y-1"
				enter-to-class="opacity-100 translate-y-0"
			>
				<div v-show="dateFilterOptionsOpen" class="absolute top-8 -left-0.5 z-3 px-1 pt-1 border-2 rounded-b-2xl w-[103.5%] theme-colors">
					<div v-for="filter in dateFilterOptions" :key="filter" @click="changeFilter(filter)" class="p-1 pl-2 hover:hover:bg-cyan-700/60 btn-transition last:rounded-b-2xl" >
						<span>{{ filter }}</span>
					</div>
				</div>
			</Transition>
		</div>

		<div class="flex gap-1 cursor-pointer items-center" @click="toggleInfoText()">
			<Info class="size-7 btn-transition"/>
			<div v-show="state.isPieChartInfoVisible" class="max-sm:text-xs ">
				{{ t('chartInfoText') }}
			</div>
			
		</div>
	</div>	
	<div class="w-full h-full min-w-0 p-2">
		<Doughnut v-if="isChartShown" :data="getChartData" :options="getChartOptions" />
		<div class="w-full h-full sm:text-3xl mt-3" v-else>{{ t('noDataText') }} {{ t(financeTypeFilter) }} : {{ dateFilter }}</div>
	</div>
</div>
</template>

<script lang="ts">
import { Doughnut } from 'vue-chartjs'
import { useGlobalStore, type FinanceDate } from '@/state';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale} from 'chart.js'
import { useI18n } from 'vue-i18n';
import { ChevronDown } from 'lucide-vue-next';
import { Info } from 'lucide-vue-next';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale)

export default {
	name: 'LineChart',
	components: { 
		Doughnut,
		ChevronDown,
		Info
	 },

	setup() {
		const state = useGlobalStore();
		const { t } = useI18n();
		
		return { state, t}
	},

	data() {
		return {
			dateFilter: this.getDateFilterOptions()[0] ?? '' as string,
			dateFilterOptions: this.getDateFilterOptions() as string[] | null,
			dateFilterOptionsOpen: false as boolean,
			financeTypeFilter: 'expenses' as string,
			financeTypeFilterOptions: ['expenses', 'revenues'] as string[],
			financeTypeFilterOptionsOpen: false as boolean,
		}
	},

	methods: {

		changeFilter(filter: string) {
			this.dateFilter = filter;
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

		getDateFilterOptions() : string[] {

			let filterOptions: string[] = [];

			const monthFilterOptions: string[] = this.state.getFinancesPerMonth.map(finance => finance.date);

			const yearFilterOptions: string[] = this.state.getFinancesPerYear.map(finance => finance.date );

			if(monthFilterOptions.length > 0) {
				filterOptions = [...monthFilterOptions]
			}

			if(yearFilterOptions.length > 0) {
				filterOptions = [...filterOptions, ...yearFilterOptions];
			}
			console.log(filterOptions);

			return filterOptions;
		},

	},

    computed: {

		isChartShown() : boolean {
			return !this.getChartData.datasets[0].data.every(d => d === 0);
		},

        getChartData() {

			const [year, month] = this.dateFilter.split('-');
			const categories = this.state.categories.map(cat => cat.cat);
			const colors = this.state.categories.map(cat => cat.color);
			const expensesPerCategory = Array.from({length: categories.length}, () => 0);

			let financesForSearchedDate : FinanceDate[] = []; 

			if(month && year) {
				financesForSearchedDate = this.state.getFinancesPerMonth.filter(finance => finance.date === this.dateFilter);
			}
			else if (year) {
				financesForSearchedDate = this.state.getFinancesPerYear.filter(finance => finance.date === this.dateFilter);
			}

			if(financesForSearchedDate[0]){

				let fFSD = financesForSearchedDate[0].finances;
				let data: number[][] = Array.from({length: categories.length}, () => []);

				for(let i = 0; i < categories.length; i++) {
					
					for(let j = 0; j < fFSD.length; j++) {
						
						fFSD[j].categories.map(cat => cat.cat);

						console.log('tet');

						let isFilterValue = false;
						if(this.financeTypeFilter === 'revenues') {
							console.log('tet');
							isFilterValue = fFSD[j].value > 0;
						} else if(this.financeTypeFilter === 'expenses') {
							isFilterValue = fFSD[j].value < 0;
						} 
						
						if(isFilterValue && fFSD[j].categories.map(cat => cat.cat).includes(categories[i])) {
							let newValue = fFSD[j].value / fFSD[j].categories.length;
							data[i].push(newValue);
						}
					}
					
				}

				for(let i = 0; i < data.length; i++) {
					expensesPerCategory[i] = data[i].reduce((sum, value) => sum + value, 0) ?? 0;
				}
			}

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
