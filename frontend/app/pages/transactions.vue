<template>
	<div>
		<div class="px-4 py-3 text-xl font-semibold">
			Transactions Header
		</div>

		<div class="flex flex-col flex-1 w-full">
			<div class="flex px-4 py-3.5 border-b border-accented w-full">
				<UInput
					:model-value="table?.tableApi?.getColumn('email')?.getFilterValue() as string"
					placeholder="Filter emails..."
					@update:model-value="table?.tableApi?.getColumn('email')?.setFilterValue($event)"
				/>
			</div>

			<div class="w-full space-y-4 pb-4">
				<UTable
					ref="table"
					v-model:pagination="pagination"
					v-model:column-filters="columnFilters"
					:data="data"
					:columns="columns"
					:pagination-options="{
						getPaginationRowModel: getPaginationRowModel(),
					}"
					:filter-options="{
						getFilteredRowModel: getFilteredRowModel(),
					}"
				/>

				<div class="flex justify-center border-t border-default pt-4">
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
import { h, resolveComponent } from 'vue';
import { getPaginationRowModel, getFilteredRowModel } from '@tanstack/vue-table';
import type { TableColumn } from '@nuxt/ui';

definePageMeta({
	layout: 'dashboard',
});

const table = useTemplateRef('table');

const pagination = ref({
	pageIndex: 0,
	pageSize: 5,
});

const columns: TableColumn<Payment>[] = [
	{
		accessorKey: 'id',
		header: '#',
		cell: ({ row }) => `#${row.getValue('id')}`,
	},
	{
		accessorKey: 'date',
		header: 'Date',
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
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const color = {
				paid: 'success' as const,
				failed: 'error' as const,
				refunded: 'neutral' as const,
			}[row.getValue('status') as string];

			return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
				row.getValue('status'),
			);
		},
	},
	{
		accessorKey: 'email',
		header: 'Email',
	},
	{
		accessorKey: 'amount',
		header: () => h('div', { class: 'text-right' }, 'Amount'),
		cell: ({ row }) => {
			const amount = Number.parseFloat(row.getValue('amount'));

			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'EUR',
			}).format(amount);

			return h('div', { class: 'text-right font-medium' }, formatted);
		},
	},
];

const columnFilters = ref([
	{
		id: 'email',
		value: '',
	},
]);

const UBadge = resolveComponent('UBadge');

type Payment = {
	id: string;
	date: string;
	status: 'paid' | 'failed' | 'refunded';
	email: string;
	amount: number;
};

const data = ref<Payment[]>([
	{
		id: '4600',
		date: '2024-03-11T15:30:00',
		status: 'paid',
		email: 'james.anderson@example.com',
		amount: 594,
	},
	{
		id: '4599',
		date: '2024-03-11T10:10:00',
		status: 'failed',
		email: 'mia.white@example.com',
		amount: 276,
	},
	{
		id: '4598',
		date: '2024-03-11T08:50:00',
		status: 'refunded',
		email: 'william.brown@example.com',
		amount: 315,
	},
	{
		id: '4597',
		date: '2024-03-10T19:45:00',
		status: 'paid',
		email: 'emma.davis@example.com',
		amount: 529,
	},
	{
		id: '4596',
		date: '2024-03-10T15:55:00',
		status: 'paid',
		email: 'ethan.harris@example.com',
		amount: 639,
	},
	{
		id: '4596',
		date: '2024-03-10T15:55:00',
		status: 'paid',
		email: 'ethan.harris@example.com',
		amount: 639,
	},
	{
		id: '4596',
		date: '2024-03-10T15:55:00',
		status: 'paid',
		email: 'ethan.harris@example.com',
		amount: 639,
	},
	{
		id: '4596',
		date: '2024-03-10T15:55:00',
		status: 'paid',
		email: 'ethan.harris@example.com',
		amount: 639,
	}, {
		id: '4596',
		date: '2024-03-10T15:55:00',
		status: 'paid',
		email: 'ethan.harris@example.com',
		amount: 639,
	},
]);
</script>
