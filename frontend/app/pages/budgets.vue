<template>
	<div class="bg-beige-100">
		<div class="flex justify-between items-center p-4">
			<div class="text-xl">
				{{ t('pages.budgets.title') }}
			</div>

			<UButton
				label="+ Add New Budget"
				color="primary"
				@click="open"
			/>
		</div>

		<div class="flex gap-4 p-4 rounded">
			<div class="bg-white w-1/3 p-4">
				<ClientOnly>
					<BudgetChart />
				</ClientOnly>
			</div>

			<div class="w-2/3 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
				<BudgetCard
					v-for="budget in budgets"
					:key="budget.id"
					:budget="budget"
					:items="budgets"
					@edit="() => onEditBudget"
					@delete="() => onDeleteBudget"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import BudgetChart from '~/components/BudgetChart.client.vue';
import BudgetModal from '~/components/BudgetModal.vue';
import { useI18n } from 'vue-i18n';
import type { Budget } from '../../utils/types/api';

definePageMeta({
	layout: 'dashboard',
});

const { t } = useI18n();
const overlay = useOverlay();
const modal = overlay.create(BudgetModal);

const open = (): void => {
	modal.open();
};

const budgets = ref<Array<Budget>>([]);

const fetchBudgets = async (): Promise<void> => {
	try {
		const data = await $fetch<Array<Budget>>('http://localhost:3001/v1/budgets');
		budgets.value = data;
		console.log(budgets.value);
	}
	catch (err: unknown) {
		console.error('Failed to fetch budgets:', err);
	}
};

const editBudget = async (id: string): Promise<void> => {
	try {
		const data = await $fetch<Array<Budget>>(`http://localhost:3001/v1/budgets/${id}`);
		budgets.value = data;
		console.log(budgets.value);
	}
	catch (err: unknown) {
		console.error('Failed to edit budget:', err);
	}
};

const deleteBudget = async (id: string): Promise<void> => {
	try {
		const data = await $fetch<Array<Budget>>(`http://localhost:3001/v1/budgets/${id}`);
		budgets.value = data;
		console.log(budgets.value);
	}
	catch (err: unknown) {
		console.error('Failed to delete budget:', err);
	}
};

const onEditBudget = async (id: string): Promise<void> => {
	await editBudget(id);
};

const onDeleteBudget = async (id: string): Promise<void> => {
	await deleteBudget(id);
};

onMounted(async (): Promise<void> => {
	await fetchBudgets();
});
</script>
