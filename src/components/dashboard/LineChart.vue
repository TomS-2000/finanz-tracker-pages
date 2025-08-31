<template>
	<div class="flex flex-col min-w-0 w-full h-full">
		<div class="flex items-center gap-3">
			
			<!-- Label für Select -->
			<div class="sm:text-xl sm:font-bold">
				{{ t('financialPerfLabel') }}
			</div>

			<!-- Monat/Jahr Select -->
			<SelectAbsolute 
				:toggle-filter-options="toggleFilterOptions" 
				:filter-options-open="dateFilterOptionsOpen" 
				:filter-options="state.getDateFilterOptions" 
				:filter="state.lineChartDateFilter"
				:is-filter-translation="false"
				:change-filter="changeFilter"
				filter-label="chartChooseFilter"
				:top-width="'w-40'"
				:bottom-width="'w-[102.5%]'"
			/>

			<slot></slot>

			<!-- Diagramm Infotext -->
			<div class="flex gap-1 cursor-pointer items-center" @click="toggleInfoText()">
				<Info class="size-7 btn-transition"/>
				<div v-show="state.isLineChartInfoVisible" class="max-sm:text-xs ">
					{{ t('chartInfoText') }}
				</div>
				
			</div>

		</div>

		<!-- Linien Diagramm -->
		<div class="flex-1 w-full min-w-0 min-h-20 mb-2">
			<Line ref="chartRef" :data="getChartData" :options="getChartOption" />
		</div>

	</div>
</template>

<script lang="ts">
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { useGlobalStore } from '@/state';
import type { FinanceDate } from '@/state';
import { ChevronDown, Info } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import SelectAbsolute from './../dropdownSelect/SelectAbsolute.vue';

ChartJS.register(
	Title, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement
);

export default {
	name: 'LineChart',
	components: { 
		Line,
		ChevronDown,
		Info,
		SelectAbsolute
	 },

	setup() {
		const state = useGlobalStore();
		const { t } = useI18n();

		return { state , t }
	},

	data() {
		return {
			dateFilterOptionsOpen: false as boolean
		}
	},

	methods: {
		changeFilter(filter: string) {
			this.state.lineChartDateFilter = filter;
			this.toggleFilterOptions();
		},

		toggleFilterOptions() {
			this.dateFilterOptionsOpen = !this.dateFilterOptionsOpen;
		},

		toggleInfoText() {
			this.state.isLineChartInfoVisible = !this.state.isLineChartInfoVisible;
		},

	},

	computed: {
		getChartData() {

			const [year, month] = this.state.lineChartDateFilter.split(/[-T]/);
			let labels: string[] = [];
			
			let totalAmount = this.state.totalAmount;
			let totalAmountData: number[] = [];
			let revenueData: number[] = [];
			let expensesData: number[] = []; 
			
			// Month
			if(month && year) {

				let financesPerMonth : FinanceDate[] = this.state.getFinancesPerMonth;
				
				// Startwert für totalAmount bestimmen
				for(let i = 0; i < financesPerMonth.length; i++) {
					const [yearf, monthf] = financesPerMonth[i].date.split(/[-T]/);
					
					if ((parseInt(year) < parseInt(yearf)) || (parseInt(year) === parseInt(yearf) && parseInt(month) <= parseInt(monthf))) {
						for(let j = 0; j < financesPerMonth[i].finances.length; j++){
							totalAmount -= this.state.parseToFixed2(financesPerMonth[i].finances[j].value);
							totalAmount = this.state.parseToFixed2(totalAmount);
						}
					}
				}

				// Label festlegen
				if(['01', '03', '05', '07', '08', '10', '12'].includes(month)) {
					labels = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
				} else if (['04', '06', '09', '11'].includes(month)) {
					labels = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
				} else { // February
					if(parseInt(year) % 4 === 0) {	// Schaltjahr
						labels = Array.from({ length: 29 }, (_, i) => (i + 1).toString());
					} else {
						labels = Array.from({ length: 28 }, (_, i) => (i + 1).toString());
					}
				}

				// Daten erzeugen
				let financesForSearchedMonth = financesPerMonth.filter(finance => finance.date === this.state.lineChartDateFilter);

				let data: number[] = Array.from({ length: labels.length }, () => 0);
				revenueData = Array.from({ length: labels.length }, () => 0);
				expensesData = Array.from({ length: labels.length }, () => 0);

				if (financesForSearchedMonth.length > 0) {
					
					for (let i = 0; i < labels.length; i++) {
						const dayStr = labels[i].padStart(2, '0');
						const dayFinances = financesForSearchedMonth[0].finances.filter(finance => {
							const [, , day] = finance.date.split(/[-T]/);
							return day === dayStr;
						});
						data[i] = dayFinances.reduce((sum, f) => sum + f.value, 0) ?? 0;
						revenueData[i] = dayFinances.filter(f => f.value > 0).reduce((sum, f) => sum + f.value, 0) ?? 0;
						expensesData[i] = dayFinances.filter(f => f.value < 0).reduce((sum, f) => sum + f.value, 0) ?? 0;
					}
				}

				totalAmountData = Array.from({ length: labels.length }, () => 0);
				totalAmountData[0] = this.state.parseToFixed2(totalAmount + data[0]);

				for (let i = 1; i < data.length; i++) {
					totalAmountData[i] = totalAmountData[i - 1] + data[i];
				}
				
			} 
			// Year
			else if (!month && year) {
				// Label festlegen
				labels = [ this.t('january'), this.t('february'), this.t('march'), this.t('april'), this.t('may'), this.t('june'),
				 this.t('july'), this.t('august'), this.t('september'), this.t('october'), this.t('november'), this.t('december') ];

				let financesPerYear: FinanceDate[] = this.state.getFinancesPerYear;

				// Startwert für totalAmount bestimmen
				for (let i = 0; i < financesPerYear.length; i++) {
					const [yearf] = financesPerYear[i].date.split(/[-T]/);
					if (parseInt(year) <= parseInt(yearf)) {
						for (let j = 0; j < financesPerYear[i].finances.length; j++) {
							totalAmount -= this.state.parseToFixed2(financesPerYear[i].finances[j].value);
							totalAmount = this.state.parseToFixed2(totalAmount);
						}
					}
				}

				// Daten erzeugen
				let financesForSearcheYear = financesPerYear.filter(finance => finance.date === this.state.lineChartDateFilter);

				let data: number[] = Array.from({ length: labels.length }, () => 0);

				if (financesForSearcheYear.length > 0) {
					for (let i = 0; i < labels.length; i++) {
						const monthStr = (i + 1).toString().padStart(2, '0');
						const monthFinances = financesForSearcheYear[0].finances.filter(finance => {
							const [, monthf] = finance.date.split(/[-T]/);
							return monthf === monthStr;
						});
						data[i] = monthFinances.reduce((sum, f) => sum + f.value, 0) ?? 0;
						revenueData[i] = monthFinances.filter(f => f.value > 0).reduce((sum, f) => sum + f.value, 0) ?? 0;
						expensesData[i] = monthFinances.filter(f => f.value < 0).reduce((sum, f) => sum + f.value, 0) ?? 0;
					}
				}

				totalAmountData = Array.from({ length: labels.length }, () => 0);
				totalAmountData[0] = this.state.parseToFixed2(totalAmount + data[0]);

				for (let i = 1; i < data.length; i++) {
					totalAmountData[i] = (totalAmountData[i - 1] + data[i]);
				}
	
			}

			return {
				labels: labels,
				datasets: [
					{
						label: this.t('chartTotalAmountLabel'),
						data: totalAmountData,
						fill: false,
						borderColor: 'rgb(75, 192, 250)',
						tension: 0.01,
						pointRadius: 4,
						pointHoverRadius: 6
					},
					{
						label: this.t('chartExpensesLabel'),
						data: expensesData,
						fill: false,
						borderColor: 'rgb(250, 75, 75)',
						tension: 0.01,
						pointRadius: 4,
						pointHoverRadius: 6,
						hidden: true
					},
					{
						label: this.t('chartRevenuesLabel'),
						data: revenueData,
						fill: false,
						borderColor: 'rgb(75, 192, 75)',
						tension: 0.01,
						pointRadius: 4,
						pointHoverRadius: 6,
						hidden: true
					},
				]
			} 
		},

		getChartOption() {
			const color = this.state.isDark ? '#f7fafc' : '#1a202c';
			const colorGrid = this.state.isDark ? 'lightgrey': 'grey';

			const chartOptions =  {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						labels: {
							color: color,
							font: {
								size: 16
							}
						}
					}
				},
				scales: {
					x: { 
						ticks: { color: color },
						grid: { color: colorGrid},
					},
					y: { 
						ticks: { color: color },
						grid: { color: colorGrid},
					}
				}
			}

			return chartOptions;
		}
	},	
}
</script>

