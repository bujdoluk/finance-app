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
					${{ summary?.attributes.balance.toFixed(2) ?? 0 }}
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
					${{ summary?.attributes.income.toFixed(2) ?? 0 }}
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
					${{ summary?.attributes.expenses.toFixed(2) ?? 0 }}
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
import type {
	BalanceResource,
	BillResource,
	BillsResponse,
	BudgetResource,
	BudgetsResponse,
	PotResource,
	PotsResponse,
	TransactionResource,
	TransactionsResponse,
} from '../../utils/types/api';
import TransactionsOverview from '~/components/TransactionsOverview.vue';
import type { PaginationState } from '@tanstack/vue-table';

definePageMeta({
	layout: 'dashboard',
});

const { t } = useI18n();
const appConfig = useAppConfig();
const loading = ref<boolean>();

const bills = ref<BillResource[]>([]);
const loadingBills = ref<boolean>();
const billsPagination = ref<PaginationState>({
	pageIndex: 0,
	pageSize: 3,
});

const fetchBills = async (): Promise<void> => {
	try {
		loadingBills.value = true;

		const query: Record<string, string | number> = {
			'page[limit]': billsPagination.value.pageSize,
			'page[offset]': billsPagination.value.pageSize * billsPagination.value.pageIndex,
		};

		const res = await $fetch<BillsResponse>(`${appConfig.api}/bills`, { query });
		bills.value = res.data;
	}
	catch (err: unknown) {
		console.error('fetchBills failed:', err);
		bills.value = [];
	}
	finally {
		loadingBills.value = false;
	}
};

const budgets = ref<BudgetResource[]>([]);
const loadingBudgets = ref<boolean>();
const budgetsPagination = ref<PaginationState>({
	pageIndex: 0,
	pageSize: 4,
});

const fetchBudgets = async (): Promise<void> => {
	try {
		loadingBudgets.value = true;

		const query: Record<string, string | number> = {
			'page[limit]': budgetsPagination.value.pageSize,
			'page[offset]': budgetsPagination.value.pageSize * budgetsPagination.value.pageIndex,
		};

		const res = await $fetch<BudgetsResponse>(`${appConfig.api}/budgets`, { query });
		budgets.value = res.data;
	}
	catch (err: unknown) {
		console.error('Failed to fetch budgets:', err);
		budgets.value = [];
	}
	finally {
		loadingBudgets.value = false;
	}
};

const pots = ref<PotResource[]>([]);
const loadingPots = ref<boolean>();
const potsPagination = ref<PaginationState>({
	pageIndex: 0,
	pageSize: 4,
});

const fetchPots = async (): Promise<void> => {
	try {
		loadingPots.value = true;

		const query: Record<string, string | number> = {
			'page[limit]': potsPagination.value.pageSize,
			'page[offset]': potsPagination.value.pageSize * potsPagination.value.pageIndex,
		};

		const res = await $fetch<PotsResponse>(`${appConfig.api}/pots`, { query });
		pots.value = res.data;
	}
	catch (err: unknown) {
		console.error('fetchPots failed:', err);
		pots.value = [];
	}
	finally {
		loadingPots.value = false;
	}
};

const transactions = ref<TransactionResource[]>([]);
const loadingTransactions = ref<boolean>();
const transactionsPagination = ref<PaginationState>({
	pageIndex: 0,
	pageSize: 4,
});

const fetchTransactions = async (): Promise<void> => {
	try {
		loadingTransactions.value = true;

		const query: Record<string, string | number> = {
			'page[limit]': transactionsPagination.value.pageSize,
			'page[offset]': transactionsPagination.value.pageSize * transactionsPagination.value.pageIndex,
		};

		const res = await $fetch<TransactionsResponse>(`${appConfig.api}/transactions`, { query });
		transactions.value = res.data;
	}
	catch (err: unknown) {
		console.error('fetchTransactions failed:', err);
		transactions.value = [];
	}
	finally {
		loadingTransactions.value = false;
	}
};

const summary = ref<BalanceResource | null>(null);
const loadingSummary = ref<boolean>();

const fetchBalance = async () => {
	loadingSummary.value = true;
	try {
		const res = await $fetch<BalanceResource>(`${appConfig.api}/transactions/balance`);
		summary.value = res;
	}
	catch (err: unknown) {
		console.error('fetchBalance failed:', err);
		summary.value = null;
	}
	finally {
		loadingSummary.value = false;
	}
};

onMounted(async (): Promise<void> => {
	await Promise.all([
		fetchBills(),
		fetchBudgets(),
		fetchPots(),
		fetchTransactions(),
		fetchBalance(),
	]);
});
</script>
