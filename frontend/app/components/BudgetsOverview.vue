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
				<BudgetChart :budgets="budgets" />
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
							class="h-12 pr-2"
							size="lg"
							:color="`text--color-${budget.attributes.theme}`"
						/>
					</div>
					<div>
						<div>{{ budget.attributes.name }}</div>
						<div>${{ budget.attributes.amount }}</div>
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
