<template>
	<div class="p-8 h-750 flex flex-col overflow-y-auto">
		<div class="text-3xl pb-8 font-medium">
			{{ t('pages.bills.title') }}
		</div>

		<div class="flex flex-col lg:flex-row gap-8">
			<div class="flex flex-col w-full lg:w-1/3 gap-8">
				<div
					v-if="loadingTotal"
					class="flex flex-col gap-2 p-4 rounded"
				>
					<USkeleton class="h-8 w-8 rounded" />
					<USkeleton class="h-4 w-32" />
					<USkeleton class="h-8 w-32" />
				</div>
				<UCard
					v-else
					class="bg-gray-900 rounded text-white"
				>
					<div>
						<UIcon
							name="i-material-symbols:payments-outline"
							class="size-5"
						/>
					</div>
					<div>{{ t('pages.bills.totalBills') }}</div>
					<div class="text-2xl font-bold">
						$1,500.00
					</div>
				</UCard>

				<div
					v-if="loadingSummary"
					class="flex flex-col rounded bg-white p-4 gap-4"
				>
					<USkeleton class="h-6 w-40" />
					<div class="flex flex-col gap-2">
						<USkeleton class="h-4 w-full rounded" />
						<USkeleton class="h-4 w-full rounded" />
						<USkeleton class="h-4 w-full rounded" />
					</div>
				</div>

				<UCard
					v-else
					class="flex flex-col rounded bg-white"
				>
					<div class="text-lg font-medium">
						{{ t('pages.bills.summary') }}
					</div>
					<div class="flex justify-between border-b border-accented py-2">
						<div>{{ t('pages.bills.paidBills') }}</div>
						<div class="font-medium">
							{{ billSummary?.attributes.paid }} (${{ billSummary?.attributes.paidTotal }})
						</div>
					</div>

					<div class="flex justify-between border-b border-accented py-2">
						<div>{{ t('pages.bills.totalUpcoming') }}</div>
						<div class="font-medium">
							{{ billSummary?.attributes.unpaid }} (${{ billSummary?.attributes.unpaidTotal }})
						</div>
					</div>

					<div class="flex justify-between text-secondary-red">
						<div>{{ t('pages.bills.dueSoon') }}</div>
						<div class="font-medium">
							{{ billSummary?.attributes.due_soon }} (${{ billSummary?.attributes.dueSoonTotal }})
						</div>
					</div>
				</UCard>
			</div>

			<UCard class="flex flex-1 flex-col bg-white rounded-lg flex-1">
				<div class="flex w-full items-center pb-4 lg:justify-between">
					<UInput
						:model-value="table?.tableApi?.getColumn('name')?.getFilterValue() as string"
						placeholder="Search bill ..."
						class="mr-2 min-w-50"
						@update:model-value="table?.tableApi?.getColumn('name')?.setFilterValue($event)"
					/>

					<USelect
						v-model="sortedBills"
						:items="sortOptions"
						class="mr-2 min-w-50"
						:placeholder="t('components.tables.bills.filters.sortBy')"
					/>
				</div>

				<div class="flex-1 flex flex-col justify-between">
					<UTable
						ref="table"
						v-model:column-filters="columnFilters"
						class="flex-1 min-h-154"
						:columns="columns"
						:loading="loadingTable"
						loading-color="primary"
						loading-animation="carousel"
						:data="bills"
						:filter-options="{ getFilteredRowModel: getFilteredRowModel() }"
						:ui="{
							td: 'p-2 pl-4',
						}"
					>
						<template #name-cell="{ row }">
							<div class="flex items-center gap-3">
								<UAvatar
									src="https://github.com/benjamincanac.png"
									size="md"
									:alt="`${row.original.name} avatar`"
								/>
								<div>
									<p class="font-medium text-highlighted">
										{{ row.original.name }}
									</p>
								</div>
							</div>
						</template>
						<template #action-cell="{ row }">
							<UDropdownMenu
								:items="getDropdownActions(row.original)"
								class="cursor-pointer"
							>
								<UButton
									icon="i-lucide-ellipsis-vertical"
									color="neutral"
									variant="ghost"
									aria-label="Actions"
								/>
							</UDropdownMenu>
						</template>
					</UTable>
				</div>
			</UCard>
		</div>
	</div>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { getFilteredRowModel, type PaginationState } from '@tanstack/vue-table';
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui';
import { useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import type { BillsResponse, BillSummaryResource } from '~~/utils/types/api';
import appConfig from '#build/app.config';
import type { BillColumnDefinition } from '~~/utils/types/tableColumnDefinitions';

definePageMeta({
	layout: 'dashboard',
});

const table = useTemplateRef('table');
const { t } = useI18n();
const { copy } = useClipboard();
const loadingTable = ref<boolean>();
const loadingTotal = ref<boolean>();

const sortOptions = [
	{ label: t('components.tables.bills.filters.none'), value: 'None' },
	{ label: t('components.tables.bills.filters.latest'), value: '-next_run' },
	{ label: t('components.tables.bills.filters.oldest'), value: 'next_run' },
	{ label: t('components.tables.bills.filters.atoz'), value: 'name' },
	{ label: t('components.tables.bills.filters.ztoa'), value: '-name' },
	{ label: t('components.tables.bills.filters.highest'), value: '-amount' },
	{ label: t('components.tables.bills.filters.lowest'), value: 'amount' },
];

const getDropdownActions = (bill: BillColumnDefinition): DropdownMenuItem[][] => {
	return [
		[
			{
				label: 'Copy bill Id',
				icon: 'i-lucide-copy',
				onSelect: () => {
					copy(bill.id.toString());
				},
			},
		],
		[
			{
				label: 'Delete',
				icon: 'i-lucide-trash',
				color: 'error',
			},
		],
	];
};

const columns: TableColumn<BillColumnDefinition>[] = [
	{
		accessorKey: 'id',
		header: `${t('components.tables.bills.columns.id')}`,
		cell: ({ row }) => `#${row.getValue('id')}`,
	},
	{
		accessorKey: 'name',
		header: `${t('components.tables.bills.columns.name')}`,
		cell: ({ row }) => {
			return row.getValue('name');
		},
	},
	{
		accessorKey: 'due_date',
		header: `${t('components.tables.bills.columns.dueDate')}`,
		cell: ({ row }) => {
			return new Date(row.getValue('due_date')).toLocaleString('en-US', {
				day: 'numeric',
				month: 'short',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			});
		},
	},
	{
		accessorKey: 'amount',
		header: () => h('div', { class: 'text-right' }, `${t('components.tables.bills.columns.amount')}`),
		cell: ({ row }) => {
			const amount = Number.parseFloat(row.getValue('amount'));

			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'EUR',
			}).format(amount);

			return h('div', { class: amount > 0
				? 'text-right font-medium text-green-600 text-lg'
				: 'text-right font-medium text-red-500 text-lg' }, formatted);
		},
	},
	{
		id: 'action',
	},
];

const columnFilters = ref([
	{
		id: 'name',
		value: '',
	},
]);

const bills = ref<BillColumnDefinition[]>([]);
const sortedBills = ref<string>('None');
const billsPagination = ref<PaginationState>({
	pageIndex: 0,
	pageSize: 10,
});

const fetchBills = async (): Promise<void> => {
	try {
		loadingTable.value = true;

		const query: Record<string, string | number> = {
			'page[limit]': billsPagination.value.pageSize,
			'page[offset]': billsPagination.value.pageSize * billsPagination.value.pageIndex,
		};

		if (sortedBills.value && sortedBills.value !== 'None') {
			query.sort = sortedBills.value;
		}

		const res = await $fetch<BillsResponse>(`${appConfig.api}/bills`, { query });

		bills.value = res.data.map(bill => ({
			id: bill.id,
			amount: bill.attributes.amount,
			next_run: bill.attributes.due_date,
			name: bill.attributes.name,
			frequency: bill.attributes.frequency,
		}));
	}
	catch (err: unknown) {
		console.error('fetchBills failed:', err);
		bills.value = [];
	}
	finally {
		loadingTable.value = false;
	}
};

const loadingSummary = ref<boolean>();
const billSummary = ref<BillSummaryResource | null>(null);

const fetchSummary = async (): Promise<void> => {
	try {
		loadingSummary.value = true;

		const res = await $fetch<BillSummaryResource>(`${appConfig.api}/bills/summary`);
		billSummary.value = res;
	}
	catch (err: unknown) {
		console.error('fetchSummary failed:', err);
		billSummary.value = null;
	}
	finally {
		loadingSummary.value = false;
	}
};

onMounted(async (): Promise<void> => {
	await fetchBills();
	await fetchSummary();
});

watch(sortedBills, async (newValue, oldValue): Promise<void> => {
	if (newValue !== oldValue) {
		await fetchBills();
	}
});
</script>
