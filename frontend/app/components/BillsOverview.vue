<template>
	<UCard class="h-[220px]">
		<div class="flex justify-between pb-2">
			<div class="text-xl font-medium">
				{{ t('components.billsOverview.title') }}
				<UTooltip
					v-if="billsCount > CONSTANTS.MIN_BILLS_DISPLAYED"
					:content="{
						align: 'center',
						side: 'top',
						sideOffset: 8,
					}"
					:text="t('components.billsOverview.moreBills', { count: billsCount })"
				>
					<UBadge
						class="rounded-full mr-2"
						color="secondary-green"
					>
						+{{ billsCount }}
					</UBadge>
				</UTooltip>
			</div>
			<DetailLink link="transactions" />
		</div>
		<div
			v-for="bill in visibleBills"
			:key="bill.id"
			class="pb-2"
		>
			<div class="flex justify-between rounded-lg bg-beige-100 p-2 border-l-4 border-secondary-green">
				<div class="flex items-center">
					<div>{{ bill.attributes.name }}</div>
				</div>
				<div class="font-medium">
					${{ Number(bill.attributes.amount).toFixed(2) }}
				</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import type { BillResource } from '../../utils/types/api';
import { useI18n } from 'vue-i18n';
import { CONSTANTS } from '../../utils/constants';

const props = defineProps<{
	bills: BillResource[];
}>();

const { t } = useI18n();
const visibleBills = computed((): BillResource[] => props.bills.slice(0, CONSTANTS.MAX_BILLS_DISPLAYED));
const billsCount = computed((): number => props.bills.length - CONSTANTS.MAX_BILLS_DISPLAYED);
</script>
