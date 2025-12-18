<template>
	<div class="relative w-full h-65 flex justify-center items-center">
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
import type { Budget } from '../../utils/types/api';

const props = defineProps<{
	budgets: Budget[];
}>();

const series = computed(() => props.budgets.map((budget: Budget) => Number(budget.attributes.amount)));
const total = computed(() => series.value.reduce((sum: number, val: number) => sum + val, 0));
const colors = computed(() => props.budgets.map(b => b.attributes.theme));

const chartData = {
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
};
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
