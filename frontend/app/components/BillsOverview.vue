<template>
	<UCard class="h-[220px]">
		<div class="flex justify-between pb-2">
			<div class="text-xl font-medium">
				{{ t('components.billsOverview.title') }}
				<UTooltip
					v-if="billsCount > 0"
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
import type { Bill } from '../../utils/types/api';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
	bills: Bill[];
}>();

const MAX_BILLS = 3;
const { t } = useI18n();
const visibleBills = computed(() => props.bills.slice(0, MAX_BILLS));
const billsCount = computed(() => props.bills.length - MAX_BILLS);
</script>
