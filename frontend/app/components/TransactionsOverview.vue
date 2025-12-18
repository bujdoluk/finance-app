<template>
	<UCard class="h-[320px]">
		<div class="flex justify-between pb-6">
			<div class="text-xl font-medium">
				{{ t('components.transactionsOverview.title') }}
				<UTooltip
					v-if="transactionsCount > 0"
					:content="{
						align: 'center',
						side: 'top',
						sideOffset: 8,
					}"
					:text="t('components.transactionsOverview.moreTransactions', { count: transactionsCount })"
				>
					<UBadge
						class="rounded-full mr-2"
						color="secondary-green"
					>
						+{{ transactionsCount }}
					</UBadge>
				</UTooltip>
			</div>
			<DetailLink link="transactions" />
		</div>
		<div
			v-for="(transaction, index) in visibleTransactions"
			:key="transaction.id"
		>
			<div class="flex justify-between">
				<div>
					<UUser
						name="John Doe"
						:avatar="{
							src: 'https://i.pravatar.cc/150?u=john-doe',
							icon: 'i-lucide-image',
						}"
					/>
				</div>
				<div>
					<div class="text-md font-medium text-end">
						${{ transaction.attributes.amount }}
					</div>
					<div class="text-xs text--color-gray-900">
						{{ dayjs(transaction.attributes.date).format('MMM DD, YYYY') }}
					</div>
				</div>
			</div>
			<USeparator
				v-if="index < visibleTransactions.length - 1"
				class="py-3"
			/>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import type { Transaction } from '../../utils/types/api';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';

const props = defineProps<{
	transactions: Transaction[];
}>();

const MAX_TRANSACTIONS = 4;
const { t } = useI18n();
const visibleTransactions = computed(() => props.transactions.slice(0, MAX_TRANSACTIONS));
const transactionsCount = computed(() => props.transactions.length - MAX_TRANSACTIONS);
</script>
