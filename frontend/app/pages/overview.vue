<template>
	<div class="bg-beige-100 w-full overflow-auto lg:overflow-visible">
		<div class="text-3xl p-8 font-medium">
			{{ t('pages.overview.title') }}
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 px-8 gap-8">
			<UCard
				v-if="loading"
				class="rounded-lg"
			>
				<div class="space-y-3">
					<USkeleton class="h-4 w-24" />
					<USkeleton class="h-8 w-32" />
				</div>
			</UCard>

			<UCard
				v-else
				class="bg-gray-900 rounded-lg text-white"
			>
				<div class="text-sm">
					{{ t('pages.overview.balance') }}
				</div>
				<div class="text-3xl font-bold break-words">
					$4,836.00
				</div>
			</UCard>

			<UCard
				v-if="loading"
				class="rounded-lg"
			>
				<div class="space-y-3">
					<USkeleton class="h-4 w-24" />
					<USkeleton class="h-8 w-32" />
				</div>
			</UCard>

			<UCard
				v-else
				class="bg-white rounded-lg"
			>
				<div class="text-sm">
					{{ t('pages.overview.income') }}
				</div>
				<div class="text-3xl font-bold break-words">
					$4,836.00
				</div>
			</UCard>

			<UCard
				v-if="loading"
				class="rounded-lg"
			>
				<div class="space-y-3">
					<USkeleton class="h-4 w-24" />
					<USkeleton class="h-8 w-32" />
				</div>
			</UCard>

			<UCard
				v-else
				class="bg-white rounded-lg"
			>
				<div class="text-sm">
					{{ t('pages.overview.expenses') }}
				</div>
				<div class="text-3xl font-bold break-words">
					$4,836.00
				</div>
			</UCard>
		</div>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
			<div class="flex flex-col min-h-0">
				<div class="pb-8">
					<UCard v-if="loadingPots">
						<div class="flex justify-between pb-4 items-center">
							<USkeleton class="h-6 w-40" />
							<USkeleton class="h-6 w-16 rounded-full" />
						</div>

						<div class="flex gap-4">
							<div class="flex w-1/2 bg-beige-100 rounded-lg p-4 gap-4">
								<div class="flex w-1/4 items-center justify-center">
									<USkeleton class="h-12 w-12 rounded-full" />
								</div>
								<div class="flex flex-col justify-around flex-1">
									<USkeleton class="h-4 w-20" />
									<USkeleton class="h-8 w-32" />
								</div>
							</div>

							<div class="grid flex-1 grid-cols-2 gap-2 max-h-40">
								<div
									v-for="i in 4"
									:key="i"
									class="flex p-2"
								>
									<div>
										<USkeleton class="h-12 w-1 rounded" />
									</div>
									<div class="ml-2 flex flex-col gap-1">
										<USkeleton class="h-3 w-16" />
										<USkeleton class="h-4 w-20" />
									</div>
								</div>
							</div>
						</div>
					</UCard>

					<PotsOverview
						v-else
						:pots="pots"
					/>
				</div>

				<div class="flex-1 min-h-0">
					<UCard
						v-if="loadingTransactions"
						class="h-[320px] flex flex-col p-4"
					>
						<div class="flex justify-between pb-6 items-center">
							<USkeleton class="h-6 w-40" />
							<USkeleton class="h-6 w-16 rounded-full" />
						</div>

						<div class="flex flex-col gap-4 flex-1 overflow-y-auto">
							<div
								v-for="i in 4"
								:key="i"
								class="flex justify-between items-center"
							>
								<USkeleton class="h-10 w-10 rounded-full" />

								<div class="flex flex-col items-end gap-1">
									<USkeleton class="h-4 w-20" />
									<USkeleton class="h-3 w-16" />
								</div>
							</div>
						</div>
					</UCard>

					<TransactionsOverview
						v-else
						:transactions="transactions"
					/>
				</div>
			</div>

			<div class="flex flex-col gap-8">
				<div>
					<UCard
						v-if="loadingBudgets"
						class="h-[330px] flex flex-col"
					>
						<div class="flex justify-between pb-4 items-center">
							<USkeleton class="h-6 w-40" />
							<USkeleton class="h-6 w-16 rounded-full" />
						</div>

						<div class="flex flex-1 gap-4">
							<div class="w-2/3 h-full">
								<USkeleton class="h-full w-full rounded-lg" />
							</div>

							<div class="flex flex-col justify-center pb-2 flex-1 gap-2">
								<div
									v-for="i in 4"
									:key="i"
									class="flex p-2 items-center gap-2"
								>
									<USkeleton class="h-12 w-1 rounded" />
									<div class="flex flex-col gap-1">
										<USkeleton class="h-4 w-20" />
										<USkeleton class="h-4 w-24" />
									</div>
								</div>
							</div>
						</div>
					</UCard>

					<BudgetsOverview
						v-else
						:budgets="budgets"
					/>
				</div>
				<div>
					<UCard
						v-if="loadingBills"
						class="h-[220px] flex flex-col p-4"
					>
						<div class="flex justify-between pb-2 items-center">
							<USkeleton class="h-6 w-40" />
							<USkeleton class="h-6 w-16 rounded-full" />
						</div>

						<div class="flex flex-col gap-2 flex-1">
							<div
								v-for="i in 3"
								:key="i"
								class="flex justify-between rounded-lg bg-beige-100 p-2"
							>
								<div class="flex items-center gap-2">
									<USkeleton class="h-4 w-24" />
								</div>
								<USkeleton class="h-4 w-16" />
							</div>
						</div>
					</UCard>

					<BillsOverview
						v-else
						:bills="bills"
					/>
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
const loading = ref<boolean>();
const loadingBills = ref<boolean>();
const loadingBudgets = ref<boolean>();
const loadingPots = ref<boolean>();
const loadingTransactions = ref<boolean>();

const fetchBills = async (): Promise<void> => {
	try {
		loadingBills.value = true;
		const data = await $fetch<Bill[]>(`${appConfig.api}/bills`);
		bills.value = data;
	}
	catch (err: unknown) {
		console.error('fetchBills failed:', err);
	}
	finally {
		loadingBills.value = false;
	}
};

const fetchBudgets = async (): Promise<void> => {
	try {
		loadingBudgets.value = true;
		const data = await $fetch<Budget[]>(`${appConfig.api}/budgets`);
		budgets.value = data;
	}
	catch (err: unknown) {
		console.error('fetchBudgets failed:', err);
	}
	finally {
		loadingBudgets.value = false;
	}
};

const fetchPots = async (): Promise<void> => {
	try {
		loadingPots.value = true;
		const data = await $fetch<Pot[]>(`${appConfig.api}/pots`);
		pots.value = data;
	}
	catch (err: unknown) {
		console.error('fetchPots failed:', err);
	}
	finally {
		loadingPots.value = false;
	}
};

const fetchTransactions = async (): Promise<void> => {
	try {
		loadingTransactions.value = true;
		const data = await $fetch<Transaction[]>(`${appConfig.api}/transactions`);
		transactions.value = data;
	}
	catch (err: unknown) {
		console.error('fetchTransactions failed:', err);
	}
	finally {
		loadingTransactions.value = false;
	}
};

onMounted(async (): Promise<void> => {
	await Promise.all([fetchBills(), fetchBudgets(), fetchPots(), fetchTransactions()]);
});
</script>
