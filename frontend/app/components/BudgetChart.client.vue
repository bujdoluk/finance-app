<template>
	<div class="relative w-full flex justify-center items-center">
		<apexchart
			type="donut"
			height="250"
			:options="chartData.options"
			:series="series"
		/>

		<div class="absolute text-center pointer-events-none">
			<div class="text-xl font-bold">
				${{ total }}
			</div>
			<div class="text-sm text-gray-500">
				of limit $975
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { BudgetResource } from '../../utils/types/api';

const props = defineProps<{
	budgets: BudgetResource[];
}>();

const series = computed((): number[] => props.budgets.map((budget: BudgetResource) => Number(budget.attributes.amount)));
const total = computed((): number => series.value.reduce((sum: number, val: number) => sum + val, 0));
const colors = computed((): string[] => props.budgets.map((budget: BudgetResource) => budget.attributes.theme));

const chartData = computed(() => ({
	theme: {
		palette: [colors.value],
	},
	options: {
		chart: { type: 'donut' },
		legend: { show: false },
		dataLabels: { enabled: false },
		tooltip: { enabled: false },
		fill: { colors: colors.value },
		states: {
			hover: { filter: { type: 'lighten', value: 0.5 } },
			active: { filter: { type: 'none', value: 0 } },
		},
		stroke: { width: 0 },
		plotOptions: {
			pie: {
				expandOnClick: false,
				donut: {
					size: '60%',
				},
			},
		},
	},
}));
</script>

<style scoped>
.relative {
  position: relative;
}
.absolute {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
