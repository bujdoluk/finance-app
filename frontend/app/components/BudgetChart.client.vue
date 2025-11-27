<template>
	<div>
		<apexchart
			type="donut"
			height="350"
			:options="chartData.options"
			:series="chartData.series"
		/>

		<div>
			<div>{{ t('components.budgetChart.spendingSummary') }}</div>

			<div class="flex justify-between">
				<div>Entertaiment</div>
				<div>$15.00 of $50.00</div>
			</div>

			<div class="flex justify-between">
				<div>Entertaiment</div>
				<div>$15.00 of $50.00</div>
			</div>

			<div class="flex justify-between">
				<div>Entertaiment</div>
				<div>$15.00 of $50.00</div>
			</div>

			<div class="flex justify-between">
				<div>Entertaiment</div>
				<div>$15.00 of $50.00</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const chartData = {
	series: [500, 600, 100, 200],
	options: {
		chart: { type: 'donut' },
		legend: { show: false },
		dataLabels: { enabled: false },
		tooltip: { enabled: false },
		fill: { colors: ['#9B9B9B', '#7FD320', 'red', 'yellow'] },
		states: {
			hover: { filter: { type: 'lighten', value: 0.5 } },
			active: { filter: { type: 'none', value: 0 } },
		},
		stroke: { width: 0 },
		plotOptions: {
			pie: {
				expandOnClick: false,
				donut: {
					size: '50%',
					labels: {
						show: true,
						name: { show: false },
						total: {
							show: true,
							showAlways: true,
							formatter: function (w) {
								const totals = w.globals.seriesTotals;

								const result = totals.reduce((a, b) => a + b, 0);

								return (result / 1000).toFixed(3);
							},
						},
					},
				},
			},
		},
	},
};
</script>
