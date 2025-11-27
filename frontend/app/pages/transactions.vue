<template>
	<div>
		<div class="px-4 py-3 text-xl font-semibold">
			Transactions
		</div>

		<div class="flex flex-col bg-white rounded mx-4">
			<div class="flex p-4 w-full items-center">
				<UInput
					:model-value="table?.tableApi?.getColumn('userName')?.getFilterValue() as string"
					placeholder="Filter usernames..."
					@update:model-value="table?.tableApi?.getColumn('userName')?.setFilterValue($event)"
				/>

				<div class="ml-auto pr-2">
					{{ t('components.tables.transaction.filters.sortBy') }}
				</div>
				<USelect
					v-model="sortedValue"
					class="mr-2"
					:items="filters"
				/>

				<div class="pr-2">
					{{ t('components.tables.transaction.filters.category') }}
				</div>
				<USelect
					v-model="category"
					:items="categories"
				/>
			</div>

			<div class="w-full p-4">
				<UTable
					ref="table"
					v-model:pagination="pagination"
					v-model:column-filters="columnFilters"
					class="flex-1"
					:data="data"
					:columns="columns"
					:pagination-options="{
						getPaginationRowModel: getPaginationRowModel(),
					}"
					:filter-options="{
						getFilteredRowModel: getFilteredRowModel(),
					}"
					:ui="{
						td: 'p-2 pl-4',
					}"
				>
					<template #userName-cell="{ row }">
						<div class="flex items-center gap-3">
							<UAvatar
								src="https://github.com/benjamincanac.png"
								size="md"
								:alt="`${row.original.userName} avatar`"
							/>
							<div>
								<p class="font-medium text-highlighted">
									{{ row.original.userName }}
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

				<div class="flex justify-end border-t border-default pt-4 pr-4">
					<UPagination
						:default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
						:items-per-page="table?.tableApi?.getState().pagination.pageSize"
						:total="table?.tableApi?.getFilteredRowModel().rows.length"
						@update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
					/>
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

const pagination = ref({
	pageIndex: 0,
	pageSize: 5,
});

const sortedValue = ref<string>('Latest');
const category = ref<string>('Entertaiment');

const filters = ref([
	t('components.tables.reccuringBills.filters.latest'),
	t('components.tables.reccuringBills.filters.oldest'),
	t('components.tables.reccuringBills.filters.atoz'),
	t('components.tables.reccuringBills.filters.ztoa'),
	t('components.tables.reccuringBills.filters.highest'),
	t('components.tables.reccuringBills.filters.lowest'),
]);

const categories = ref([
	t('components.tables.reccuringBills.filters.latest'),
	t('components.tables.reccuringBills.filters.oldest'),
	t('components.tables.reccuringBills.filters.atoz'),
]);

function getDropdownActions(transaction: Transaction): DropdownMenuItem[][] {
	return [
		[
			{
				label: 'Copy user Id',
				icon: 'i-lucide-copy',
				onSelect: () => {
					copy(transaction.id.toString());

					toast.add({
						title: 'User ID copied to clipboard!',
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
}

const columns: TableColumn<Transaction>[] = [
	{
		accessorKey: 'id',
		header: `${t('components.tables.transaction.columns.id')}`,
		cell: ({ row }) => `#${row.getValue('id')}`,
	},
	{
		accessorKey: 'userName',
		header: `${t('components.tables.transaction.columns.userName')}`,
		cell: ({ row }) => {
			return row.getValue('userName');
		},
	},
	{
		accessorKey: 'category',
		header: `${t('components.tables.transaction.columns.category')}`,
		cell: ({ row }) => {
			return row.getValue('category');
		},
	},
	{
		accessorKey: 'date',
		header: `${t('components.tables.transaction.columns.date')}`,
		cell: ({ row }) => {
			return new Date(row.getValue('date')).toLocaleString('en-US', {
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
		header: () => h('div', { class: 'text-right' }, `${t('components.tables.transaction.columns.amount')}`),
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
		id: 'userName',
		value: '',
	},
]);

type Transaction = {
	id: number;
	userName: string;
	date: string;
	category: string;
	amount: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: string;
};

const data = ref<Transaction[]>([
	{
		id: 4600,
		userName: 'Martin',
		date: '2024-03-11T15:30:00',
		category: 'General',
		amount: 594,
		createdAt: '2024-03-11T15:30:00',
		updatedAt: '2024-03-11T15:30:00',
		deletedAt: '',
	},
	{
		id: 4599,
		userName: 'Luke',
		date: '2024-03-11T10:10:00',
		category: 'General',
		amount: 276,
		createdAt: '2024-03-11T15:30:00',
		updatedAt: '2024-03-11T15:30:00',
		deletedAt: '',
	},
	{
		id: 4598,
		userName: 'Jane',
		date: '2024-03-11T08:50:00',
		category: 'General',
		amount: 315,
		createdAt: '2024-03-11T15:30:00',
		updatedAt: '2024-03-11T15:30:00',
		deletedAt: '',
	},
	{
		id: 4597,
		userName: 'Patrik',
		date: '2024-03-10T19:45:00',
		category: 'General',
		amount: -529,
		createdAt: '2024-03-11T15:30:00',
		updatedAt: '2024-03-11T15:30:00',
		deletedAt: '',
	},
	{
		id: 4596,
		userName: 'Tomas',
		date: '2024-03-10T15:55:00',
		category: 'General',
		amount: 639,
		createdAt: '2024-03-11T15:30:00',
		updatedAt: '2024-03-11T15:30:00',
		deletedAt: '',
	},
]);
</script>
