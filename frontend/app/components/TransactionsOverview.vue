<template>
	<UCard class="p-2">
		<div class="flex justify-between pb-8">
			<div class="text-xl">
				{{ t('components.transactionsOverview.title') }}
			</div>
			<div class="text-sm">
				View all
			</div>
		</div>
		<div
			v-for="transaction in props.transactions"
			:key="transaction.id"
		>
			<div
				class="flex justify-between"
			>
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
					<div class="text-sm font-medium">
						${{ transaction.attributes.amount }}
					</div>
					<div class="text-xs text--color-gray-900">
						{{ dayjs(transaction.attributes.date).format('MMM DD, YYYY') }}
					</div>
				</div>
			</div>
			<USeparator class="py-3" />
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

const { t } = useI18n();
</script>
