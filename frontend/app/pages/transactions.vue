<template>
	<div class="p-8 h-750 flex flex-col">
		<div class="text-2xl pb-8">
			{{ t('pages.transactions.title') }}
		</div>

		<div class="flex flex-col p-8 bg-white rounded-lg flex-1">
			<div class="flex w-full items-center pb-8">
				<UInput
					:model-value="table?.tableApi?.getColumn('sender')?.getFilterValue() as string"
					placeholder="Filter usernames..."
					@update:model-value="table?.tableApi?.getColumn('sender')?.setFilterValue($event)"
				/>

				<div class="ml-auto pr-2 text-sm">
					{{ t('components.tables.transaction.filters.sortBy') }}
				</div>
				<USelect
					v-model="sortedValue"
					class="mr-2 min-w-50"
					:items="filters"
				/>

				<div class="pr-2 text-sm">
					{{ t('components.tables.transaction.filters.category') }}
				</div>
				<USelect
					v-model="category"
					:items="categories"
					class="min-w-50"
				/>
			</div>

			<div class="flex-1 flex flex-col justify-between">
				<UTable
					ref="table"
					v-model:pagination="pagination"
					v-model:column-filters="columnFilters"
					:data="transactions"
					:columns="columns"
					class="flex-1"
					:loading="loading"
					loading-color="primary"
					loading-animation="carousel"
					:pagination-options="{ getPaginationRowModel: getPaginationRowModel() }"
					:filter-options="{ getFilteredRowModel: getFilteredRowModel() }"
					:ui="{
						td: 'p-2 pl-4',
					}"
				>
					<template #sender-cell="{ row }">
						<div class="flex items-center gap-3">
							<UAvatar
								src="https://github.com/benjamincanac.png"
								size="md"
								:alt="`${row.original.sender_picture} avatar`"
							/>
							<div>
								<p class="font-medium text-highlighted">
									{{ row.original.sender }}
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
import type { TransactionColumnDefinition } from '../../utils/types/tableColumnDefinitions';
import type { Transaction } from '../../utils/types/api';
import appConfig from '#build/app.config';
import dayjs from 'dayjs';

definePageMeta({
	layout: 'dashboard',
});

const table = useTemplateRef('table');
const { t } = useI18n();
const { copy } = useClipboard();
const loading = ref<boolean>(false);

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

function getDropdownActions(transaction: TransactionColumnDefinition): DropdownMenuItem[][] {
	return [
		[
			{
				label: 'Copy user Id',
				icon: 'i-lucide-copy',
				onSelect: () => {
					copy(transaction.id.toString());
				},
			},
		],
		[
			{
				label: 'Delete',
				icon: 'i-lucide-trash',
				color: 'error',
				onSelect: async (): Promise<void> => {
					await deleteTransaction(transaction.id);
				},
			},
		],
	];
}

const columns: TableColumn<TransactionColumnDefinition>[] = [
	{
		accessorKey: 'id',
		header: `${t('components.tables.transaction.columns.id')}`,
		cell: ({ row }) => `#${row.getValue('id')}`,
	},
	{
		accessorKey: 'sender',
		header: `${t('components.tables.transaction.columns.sender')}`,
		cell: ({ row }) => {
			return row.getValue('sender');
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
			return dayjs(row.getValue('date')).format('MMM DD, YYYY');
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
		id: 'sender',
		value: '',
	},
]);

const transactions = ref<TransactionColumnDefinition[]>([]);

const fetchTransactions = async (): Promise<void> => {
	try {
		loading.value = true;
		const data = await $fetch<Transaction[]>(`${appConfig.api}/transactions`);

		transactions.value = data.map(transaction => ({
			id: transaction.id,
			amount: transaction.attributes.amount,
			category: transaction.attributes.category,
			sender: transaction.attributes.sender,
			sender_picture: transaction.attributes.sender_picture,
			date: transaction.attributes.date,
		}));
	}
	catch (err: unknown) {
		console.error('fetchTransactions failed:', err);
	}
	finally {
		loading.value = false;
	}
};

const deleteTransaction = async (id: string): Promise<void> => {
	try {
		loading.value = true;
		await $fetch(`${appConfig.api}/transactions/${id}`, {
			method: 'DELETE',
		});
	}
	catch (err: unknown) {
		console.log('Delete transactions failed', err);
	}
	finally {
		await fetchTransactions();
		loading.value = false;
	}
};

onMounted(async (): Promise<void> => {
	await fetchTransactions();
});
</script>
