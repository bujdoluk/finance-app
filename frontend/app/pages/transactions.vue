<template>
	<div class="p-8 h-750 flex flex-col">
		<div class="flex justify-between text-3xl font-medium">
			<div>
				{{ t('pages.transactions.title') }}
			</div>
			<div class="flex items-center pb-6 gap-3">
				<UFileUpload
					v-model="file"
					accept=".csv"
					:multiple="false"
				>
					<template #default="{ open }">
						<UButton
							label="Import CSV"
							color="secondary-green"
							variant="solid"
							class="cursor-pointer"
							icon="i-lucide-upload"
							:loading="loading"
							@click="open()"
						/>
					</template>
				</UFileUpload>
			</div>
		</div>

		<UCard class="flex flex-col bg-white rounded-lg flex-1">
			<div class="flex flex-col w-full pb-8 lg:flex-row">
				<UInput
					:model-value="table?.tableApi?.getColumn('sender')?.getFilterValue() as string"
					placeholder="Search sender ..."
					class="mr-2 w-50"
					@update:model-value="table?.tableApi?.getColumn('sender')?.setFilterValue($event)"
				/>

				<div class="py-1 pr-2 text-sm my-auto lg:ml-auto lg:py-0 ">
					{{ t('components.tables.transactions.filters.sortBy') }}
				</div>
				<USelect
					v-model="sortedTransations"
					class="mr-2 w-50"
					:items="sortOptions"
				/>

				<div class="py-1 pr-2 text-sm my-auto lg:py-0">
					{{ t('components.tables.transactions.filters.category') }}
				</div>
				<USelect
					v-model="category"
					:items="categories"
					class="w-50"
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
		</UCard>
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
const loading = ref<boolean>();

const pagination = ref({
	pageIndex: 0,
	pageSize: 5,
});

const sortOptions = [
	{ label: t('components.tables.transactions.filters.none'), value: 'None' },
	{ label: t('components.tables.transactions.filters.latest'), value: '-date' },
	{ label: t('components.tables.transactions.filters.oldest'), value: 'date' },
	{ label: t('components.tables.transactions.filters.atoz'), value: 'sender' },
	{ label: t('components.tables.transactions.filters.ztoa'), value: '-sender' },
	{ label: t('components.tables.transactions.filters.highest'), value: '-amount' },
	{ label: t('components.tables.transactions.filters.lowest'), value: 'amount' },
];

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
		header: `${t('components.tables.transactions.columns.id')}`,
		cell: ({ row }) => `#${row.getValue('id')}`,
	},
	{
		accessorKey: 'sender',
		header: `${t('components.tables.transactions.columns.sender')}`,
		cell: ({ row }) => {
			return row.getValue('sender');
		},
	},
	{
		accessorKey: 'category',
		header: `${t('components.tables.transactions.columns.category')}`,
		cell: ({ row }) => {
			return row.getValue('category');
		},
	},
	{
		accessorKey: 'date',
		header: `${t('components.tables.transactions.columns.date')}`,
		cell: ({ row }) => {
			return dayjs(row.getValue('date')).format('MMM DD, YYYY');
		},
	},
	{
		accessorKey: 'amount',
		header: () => h('div', { class: 'text-right' }, `${t('components.tables.transactions.columns.amount')}`),
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

const categories = ref<string[]>([]);
const category = ref<string>('All');

const fetchCategories = async (): Promise<void> => {
	try {
		loading.value = true;
		const data = await $fetch<string[]>(`${appConfig.api}/transactions/categories`);
		categories.value = ['All', ...data];
	}
	catch (err: unknown) {
		console.error('Failed to fetch categories:', err);
		categories.value = ['All'];
	}
	finally {
		loading.value = false;
	}
};

const transactions = ref<TransactionColumnDefinition[]>([]);
const sortedTransations = ref<string>('None');

const fetchTransactions = async (): Promise<void> => {
	try {
		loading.value = true;
		const query: Record<string, string> = {};

		if (category.value && category.value !== 'All') {
			query['filter[category]'] = category.value;
		}

		if (sortedTransations.value && sortedTransations.value !== 'None') {
			query.sort = sortedTransations.value;
		}

		const data = await $fetch<Transaction[]>(`${appConfig.api}/transactions`, {
			query,
		});

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
		transactions.value = [];
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
		await fetchCategories();
		loading.value = false;
	}
};

const file = ref<File | null>(null);

const importTransactions = async (): Promise<void> => {
	if (!file.value) return;

	const formData = new FormData();
	formData.append('file', file.value);

	try {
		loading.value = true;
		await $fetch(`${appConfig.api}/transactions/import`, {
			method: 'POST',
			body: formData,
		});
		console.log('CSV imported successfully');
	}
	catch (err: unknown) {
		console.error('CSV import failed', err);
	}
	finally {
		loading.value = false;
		file.value = null;
		await fetchTransactions();
		await fetchCategories();
	}
};

onMounted(async (): Promise<void> => {
	await fetchCategories();
	await fetchTransactions();
});

watch(category, async (newValue, oldValue): Promise<void> => {
	if (newValue !== oldValue) {
		await fetchTransactions();
	}
});

watch(sortedTransations, async (newValue, oldValue): Promise<void> => {
	if (newValue !== oldValue) {
		await fetchTransactions();
	}
});

watch(file, async (newFile): Promise<void> => {
	if (!newFile) return;
	if (!newFile.name.endsWith('.csv')) return;

	await importTransactions();
});
</script>
