<template>
	<div class="px-4">
		<div class="p-4 text-xl font-semibold">
			{{ t('pages.reccuringBills.title') }}
		</div>

		<div class="flex">
			<div class="flex flex-col w-1/3 pb-4 px-4 gap-4">
				<div class="p-4 bg-black rounded text-white">
					<div>
						<UIcon
							name="i-material-symbols:payments-outline"
							class="size-5"
						/>
					</div>
					<div>{{ t('pages.reccuringBills.totalBills') }}</div>
					<div class="text-2xl font-bold">
						$1,500.00
					</div>
				</div>
				<div class="flex flex-col rounded bg-white p-4 gap-4">
					<div class="text-lg font-medium">
						{{ t('pages.reccuringBills.summary') }}
					</div>
					<div class="flex justify-between border-b border-accented py-2">
						<div>{{ t('pages.reccuringBills.paidBills') }}</div>
						<div class="font-medium">
							$50
						</div>
					</div>

					<div class="flex justify-between border-b border-accented py-2">
						<div>{{ t('pages.reccuringBills.totalUpcoming') }}</div>
						<div class="font-medium">
							$50
						</div>
					</div>

					<div class="flex justify-between text-red-500">
						<div>{{ t('pages.reccuringBills.dueSoon') }}</div>
						<div class="font-medium">
							$50
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-col flex-1 w-full bg-white rounded p-4">
				<div class="flex px-4 py-4 w-full justify-between">
					<UInput
						:model-value="table?.tableApi?.getColumn('billTitle')?.getFilterValue() as string"
						placeholder="Search bills"
						@update:model-value="table?.tableApi?.getColumn('billTitle')?.setFilterValue($event)"
					/>

					<USelect
						:items="filters"
						:placeholder="t('components.tables.reccuringBills.filters.sortBy')"
					/>
				</div>

				<div class="w-full">
					<UTable
						ref="table"
						v-model:column-filters="columnFilters"
						class="flex-1"
						:data="data"
						:columns="columns"
						:filter-options="{
							getFilteredRowModel: getFilteredRowModel(),
						}"
						:ui="{
							td: 'p-2 pl-4',
						}"
					>
						<template #billTitle-cell="{ row }">
							<div class="flex items-center gap-3">
								<UAvatar
									src="https://github.com/benjamincanac.png"
									size="md"
									:alt="`${row.original.billTitle} avatar`"
								/>
								<div>
									<p class="font-medium text-highlighted">
										{{ row.original.billTitle }}
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
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { getPaginationRowModel, getFilteredRowModel } from '@tanstack/vue-table';
import type { TableColumn, DropdownMenuItem } from '@nuxt/ui';
import { useClipboard } from '@vueuse/core';
import { useI18n } from 'vue-i18n';

definePageMeta({
	layout: 'dashboard',
});

const table = useTemplateRef('table');
const { t } = useI18n();
const toast = useToast();
const { copy } = useClipboard();

const filters = ref([
	t('components.tables.reccuringBills.filters.latest'),
	t('components.tables.reccuringBills.filters.oldest'),
	t('components.tables.reccuringBills.filters.atoz'),
	t('components.tables.reccuringBills.filters.ztoa'),
	t('components.tables.reccuringBills.filters.highest'),
	t('components.tables.reccuringBills.filters.lowest'),
]);

interface ReccuringBill {
	id: number;
	billTitle: string;
	dueDate: string;
	amount: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
}

const getDropdownActions = (transaction: ReccuringBill): DropdownMenuItem[][] => {
	return [
		[
			{
				label: 'Copy bill Id',
				icon: 'i-lucide-copy',
				onSelect: () => {
					copy(transaction.id.toString());

					toast.add({
						title: 'Bill ID copied to clipboard!',
						color: 'success',
						icon: 'i-lucide-circle-check',
					});
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

const columns: TableColumn<ReccuringBill>[] = [
	{
		accessorKey: 'id',
		header: `${t('components.tables.reccuringBills.columns.id')}`,
		cell: ({ row }) => `#${row.getValue('id')}`,
	},
	{
		accessorKey: 'billTitle',
		header: `${t('components.tables.reccuringBills.columns.billTitle')}`,
		cell: ({ row }) => {
			return row.getValue('billTitle');
		},
	},
	{
		accessorKey: 'dueDate',
		header: `${t('components.tables.reccuringBills.columns.dueDate')}`,
		cell: ({ row }) => {
			return new Date(row.getValue('dueDate')).toLocaleString('en-US', {
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
		header: () => h('div', { class: 'text-right' }, `${t('components.tables.reccuringBills.columns.amount')}`),
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
		id: 'billTitle',
		value: '',
	},
]);

const data = ref<Array<ReccuringBill>>([
	{
		id: 1,
		billTitle: 'Martin',
		dueDate: '2024-03-11T15:30:00',
		amount: 594,
		createdAt: '2024-03-11T15:30:00',
		updatedAt: '2024-03-11T15:30:00',
		deletedAt: '',
	},
	{
		id: 2,
		billTitle: 'Luke',
		dueDate: '2024-03-11T10:10:00',
		amount: 276,
		createdAt: '2024-03-11T15:30:00',
		updatedAt: '2024-03-11T15:30:00',
		deletedAt: '',
	},
	{
		id: 3,
		billTitle: 'Jane',
		dueDate: '2024-03-11T08:50:00',
		amount: 315,
		createdAt: '2024-03-11T15:30:00',
		updatedAt: '2024-03-11T15:30:00',
		deletedAt: '',
	},
	{
		id: 4,
		billTitle: 'Patrik',
		dueDate: '2024-03-10T19:45:00',
		amount: -529,
		createdAt: '2024-03-11T15:30:00',
		updatedAt: '2024-03-11T15:30:00',
		deletedAt: '',
	},
	{
		id: 5,
		billTitle: 'Tomas',
		dueDate: '2024-03-10T15:55:00',
		amount: 639,
		createdAt: '2024-03-11T15:30:00',
		updatedAt: '2024-03-11T15:30:00',
		deletedAt: '',
	},
]);
</script>
