<template>
	<div class="bg-beige-100 w-full">
		<div class="text-3xl p-8 font-medium">
			{{ t('pages.overview.title') }}
		</div>
		<div class="grid grid-cols-3 px-8 gap-8">
			<UCard class="bg-black rounded-lg text-white">
				<div class="text-sm">
					{{ t('pages.overview.balance') }}
				</div>
				<div class="text-3xl font-bold">
					$4,836.00
				</div>
			</UCard>

			<UCard class="bg-white rounded-lg">
				<div class="text-sm">
					{{ t('pages.overview.income') }}
				</div>
				<div class="text-3xl font-bold">
					$4,836.00
				</div>
			</UCard>

			<UCard class="bg-white rounded-lg">
				<div class="text-sm">
					{{ t('pages.overview.expenses') }}
				</div>
				<div class="text-3xl font-bold">
					$4,836.00
				</div>
			</UCard>
		</div>
		<div class="grid grid-cols-2">
			<div>
				<div class="pl-8 pr-4 py-8">
					<PotsOverview :pots="pots" />
				</div>
				<div class="pl-8 pr-4 pb-8">
					<TransactionsOverview :transactions="transactions" />
				</div>
			</div>
			<div>
				<div class="py-8 pr-8 pl-4">
					<BudgetsOverview :budgets="budgets" />
				</div>
				<div class="pb-8 pr-8 pl-4">
					<BillsOverview :bills="bills" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Bill, Budget, Pot, Transaction } from '../../utils/types/api';
import TransactionsOverview from '~/components/TransactionsOverview.vue';

definePageMeta({
	layout: 'dashboard',
});

const { t } = useI18n();
const appConfig = useAppConfig();
const bills = ref<Bill[]>([]);
const pots = ref<Pot[]>([]);
const budgets = ref<Budget[]>([]);
const transactions = ref<Transaction[]>([]);

const fetchBills = async (): Promise<void> => {
	try {
		const data = await $fetch<Bill[]>(`${appConfig.api}/bills`);
		bills.value = data;
	}
	catch (err: unknown) {
		console.error('fetchBills failed:', err);
	}
};

const fetchBudgets = async (): Promise<void> => {
	try {
		const data = await $fetch<Budget[]>(`${appConfig.api}/budgets`);
		budgets.value = data;
	}
	catch (err: unknown) {
		console.error('fetchBudgets failed:', err);
	}
};

const fetchPots = async (): Promise<void> => {
	try {
		const data = await $fetch<Pot[]>(`${appConfig.api}/pots`);
		pots.value = data;
	}
	catch (err: unknown) {
		console.error('fetchPots failed:', err);
	}
};

const fetchTransactions = async (): Promise<void> => {
	try {
		const data = await $fetch<Transaction[]>(`${appConfig.api}/transactions`);
		transactions.value = data;
	}
	catch (err: unknown) {
		console.error('fetchTransactions failed:', err);
	}
};

onMounted(async (): Promise<void> => {
	await Promise.all([fetchBills(), fetchBudgets(), fetchPots(), fetchTransactions()]);
});
</script>

<style scoped>
.width {
	width: 400px;
}
</style>
