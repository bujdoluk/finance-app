<template>
	<UCard class="h-[330px] flex flex-col">
		<div class="flex justify-between">
			<div class="text-xl font-medium">
				{{ t('components.budgetsOverview.title') }}
				<UTooltip
					v-if="budgetsCount > CONSTANTS.MIN_BUDGETS"
					:content="{
						align: 'center',
						side: 'top',
						sideOffset: 8,
					}"
					:text="t('components.budgetsOverview.moreBudgets', { count: budgetsCount })"
				>
					<UBadge
						class="rounded-full mr-2"
						color="secondary-green"
					>
						+{{ budgetsCount }}
					</UBadge>
				</UTooltip>
			</div>
			<DetailLink link="budgets" />
		</div>

		<div class="flex">
			<div class="w-2/3">
				<ClientOnly>
					<BudgetChart :budgets="budgets" />
				</ClientOnly>
			</div>

			<div class="flex flex-col justify-center pb-2">
				<div
					v-for="budget in visibleBudgets"
					:key="budget.id"
					class="flex p-2"
				>
					<div>
						<USeparator
							orientation="vertical"
							class="h-12 pr-2"
							size="lg"
							:color="themeHexToColorNameMap[budget.attributes.theme]"
						/>
					</div>
					<div>
						<div>{{ budget.attributes.name }}</div>
						<div>${{ Number(budget.attributes.amount).toFixed(2) }}</div>
					</div>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import BudgetChart from '~/components/BudgetChart.client.vue';
import type { BudgetResource } from '../../utils/types/api';
import { themeHexToColorNameMap } from '../../utils/types/theme';
import { useI18n } from 'vue-i18n';
import { CONSTANTS } from '~~/utils/constants';

const props = defineProps<{
	budgets: BudgetResource[];
}>();

const { t } = useI18n();
const visibleBudgets = computed((): BudgetResource[] => props.budgets.slice(0, CONSTANTS.MAX_BUDGETS_DISPLAYED));
const budgetsCount = computed((): number => props.budgets.length - CONSTANTS.MAX_BUDGETS_DISPLAYED);
</script>
