<template>
	<div class="bg-stone-100 w-full">
		<div class="text-3xl pb-8 font-medium">
			{{ t('pages.overview.title') }}
		</div>
		<div class="grid grid-cols-3 px-8 gap-8">
			<div class="bg-black rounded-lg p-4 text-white ">
				<div class="text-sm">
					{{ t('pages.overview.balance') }}
				</div>
				<div class="text-3xl font-bold">
					$4,836.00
				</div>
			</div>

			<div class="bg-white rounded-lg p-4">
				<div class="text-sm">
					{{ t('pages.overview.income') }}
				</div>
				<div class="text-3xl font-bold">
					$4,836.00
				</div>
			</div>

			<div class="bg-white rounded-lg p-4">
				<div class="text-sm">
					{{ t('pages.overview.expenses') }}
				</div>
				<div class="text-3xl font-bold">
					$4,836.00
				</div>
			</div>
		</div>
		<div class="grid grid-cols-2">
			<div>
				<div>Pots</div>
				<div>Budgets</div>
				<div>Transactions</div>
				<div>
					<div>
						<div>Reccuring bills</div>
						<div>see details</div>
					</div>
					<div>
						<div>Paid Bills</div>
						<div>190</div>
					</div>
					<div>
						<div>Paid Bills</div>
						<div>190</div>
					</div>
					<div>
						<div>Paid Bills</div>
						<div>190</div>
					</div>
				</div>
			</div>

			<div class="width">
				<div class="flex justify-between">
					<div>Budgets</div>
					<div>See Details</div>
				</div>

				<div class="flex justify-between">
					<ClientOnly>
						<BudgetChart />
					</ClientOnly>

					<div class="flex flex-col">
						<div class="flex p-2">
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

						<div class="flex p-2">
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

						<div class="flex p-2">
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
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import BudgetChart from '~/components/BudgetChart.client.vue';
import { useI18n } from 'vue-i18n';
import type { Bill, Budget, Pot, Transaction } from '../../utils/types/api';

definePageMeta({
	layout: 'dashboard',
});

const { t } = useI18n();
const appConfig = useAppConfig();
const bills = ref<Array<Bill>>([]);
const pots = ref<Array<Pot>>([]);
const budgets = ref<Array<Budget>>([]);
const transactions = ref<Array<Transaction>>([]);

const fetchBills = async (): Promise<void> => {
	try {
		const data = await $fetch<Array<Bill>>(`${appConfig.api}/bills`);
		bills.value = data;
	}
	catch (err: unknown) {
		console.error('fetchBills failed:', err);
	}
};

const fetchBudgets = async (): Promise<void> => {
	try {
		const data = await $fetch<Array<Budget>>(`${appConfig.api}/budgets`);
		budgets.value = data;
	}
	catch (err: unknown) {
		console.error('fetchBudgets failed:', err);
	}
};

const fetchPots = async (): Promise<void> => {
	try {
		const data = await $fetch<Array<Pot>>(`${appConfig.api}/pots`);
		pots.value = data;
	}
	catch (err: unknown) {
		console.error('fetchPots failed:', err);
	}
};

const fetchTransactions = async (): Promise<void> => {
	try {
		const data = await $fetch<Array<Transaction>>(`${appConfig.api}/transactions`);
		transactions.value = data;
	}
	catch (err: unknown) {
		console.error('fetchTransactions failed:', err);
	}
};

onMounted(async (): Promise<void> => {
	await Promise.all([fetchBills, fetchBudgets, fetchPots, fetchTransactions]);
});
</script>

<style scoped>
.width {
	width: 400px;
}
</style>
