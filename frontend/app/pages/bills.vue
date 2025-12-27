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
						:placeholder="t('pages.bills.searchPlaceholder')"
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
						<template #status-cell="{ row }">
							<div class="flex justify-end">
								<UBadge
									:trailing-icon="getStatusIcon(row.original.status)"
									size="md"
									class="flex justify-center items-center w-22"
									:class="getStatusClass(row.original.status)"
								>
									{{ formatStatusLabel(row.original.status) }}
								</UBadge>
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
		cell: ({ row }) => `#${row.getValue<string>('id')}`,
	},
	{
		accessorKey: 'name',
		header: `${t('components.tables.bills.columns.name')}`,
		cell: ({ row }) => {
			return row.getValue<string>('name');
		},
	},
	{
		id: 'frequency',
		header: t('components.tables.bills.columns.frequency'),
		accessorFn: row => row.frequency,
		cell: ({ row, getValue }) => {
			const frequency = getValue<string | null>();
			const dueDate = row.original.due_date;

			if (!frequency || !dueDate) return '—';

			const day = new Date(dueDate).getDate();

			const ordinal = (number: number) => {
				const rule = new Intl.PluralRules('en', { type: 'ordinal' }).select(number);
				const suffixes: Record<string, string> = {
					one: 'st',
					two: 'nd',
					few: 'rd',
					other: 'th',
				};

				return `${number}${suffixes[rule]}`;
			};

			const frequencyLabel = frequency.charAt(0).toUpperCase() + frequency.slice(1).toLowerCase();

			return `${frequencyLabel} ${ordinal(day)}`;
		},
	},
	{
		accessorKey: 'amount',
		header: () => h('div', { class: 'text-right' }, `${t('components.tables.bills.columns.amount')}`),
		cell: ({ row }) => {
			const amount = Number.parseFloat(row.getValue<string>('amount'));
			const status = row.original.status;

			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(amount);

			return h('div', { class: status === 'due_soon'
				? 'text-right text-secondary-red font-medium text-lg'
				: 'text-right text-gray-900 font-medium text-lg',
			}, formatted);
		},
	},
	{
		accessorKey: 'status',
		header: () => h('div', { class: 'text-right' }, `${t('components.tables.bills.columns.status')}`),
		cell: ({ row }) => {
			return row.getValue<string>('status');
		},
	},
	{
		id: 'action',
	},
];

const getStatusIcon = (status: string | null): string => {
	switch (status) {
		case 'paid':
			return 'i-lucide-check';
		case 'due_soon':
			return 'i-lucide-triangle-alert';
		case 'unpaid':
			return 'i-lucide-x';
		default:
			return '';
	}
};

const getStatusClass = (status: string | null): string => {
	switch (status) {
		case 'paid':
			return 'bg-secondary-green text-white';
		case 'unpaid':
			return 'bg-gray-900 text-white';
		case 'due_soon':
			return 'bg-secondary-red text-white';
		default:
			return 'bg-gray-900 text-white';
	}
};

const formatStatusLabel = (status: string | null) => {
	if (!status) return '—';
	return status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1);
};

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
			due_date: bill.attributes.due_date,
			name: bill.attributes.name,
			frequency: bill.attributes.frequency,
			status: bill.attributes.status,
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
