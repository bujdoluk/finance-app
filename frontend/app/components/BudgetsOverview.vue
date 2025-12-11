<template>
	<UCard>
		<div class="flex justify-between">
			<div class="text-xl">
				{{ t('components.budgetsOverview.title') }}
			</div>
			<DetailLink link="budgets" />
		</div>

		<div class="flex justify-between">
			<ClientOnly>
				<BudgetChart />
			</ClientOnly>

			<div class="flex flex-col">
				<div
					v-for="budget in props.budgets"
					:key="budget.id"
					class="flex p-2"
				>
					<div>
						<USeparator
							orientation="vertical"
							class="h-12"
							size="lg"
							color="primary"
						/>
					</div>
					<div>
						<div>Entertainment</div>
						<div>$50.00</div>
					</div>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import BudgetChart from '~/components/BudgetChart.client.vue';
import type { Budget } from '../../utils/types/api';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
	budgets: Budget[];
}>();

const { t } = useI18n();
</script>
