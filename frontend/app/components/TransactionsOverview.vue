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
					<div
						class="text-md font-medium text-end"
						:class="transaction.attributes.transaction_type === 'income' ? 'text-primary': 'text-secondary-red'"
					>
						{{ transaction.attributes.transaction_type === 'income' ? '' : '-' }}${{ transaction.attributes.amount }}
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
import type { TransactionResource } from '../../utils/types/api';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import { CONSTANTS } from '../../utils/constants';

const props = defineProps<{
	transactions: TransactionResource[];
}>();

const { t } = useI18n();
const visibleTransactions = computed((): TransactionResource[] => props.transactions.slice(0, CONSTANTS.MAX_TRANSACTIONS_DISPLAYED));
const transactionsCount = computed((): number => props.transactions.length - CONSTANTS.MAX_TRANSACTIONS_DISPLAYED);
</script>
