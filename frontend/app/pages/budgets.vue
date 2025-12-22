<template>
	<div class="bg-beige-100 p-8 h-750 oveflow-y-auto">
		<div class="flex justify-between items-center">
			<div class="text-3xl pb-8 font-medium">
				{{ t('pages.budgets.title') }}
			</div>
			<div>
				<BudgetModal
					:modal-state="'add'"
					@created="onBudgetCreated"
				/>
			</div>
		</div>

		<div class="flex flex-col lg:flex-row gap-8 rounded-lg">
			<div class="bg-white w-full lg:w-1/3">
				<ClientOnly>
					<BudgetChart :budgets="budgets" />
				</ClientOnly>
			</div>

			<div class="w-full lg:w-2/3 flex flex-col gap-8 max-h-[80vh] overflow-y-auto">
				<BudgetCard
					v-for="budget in budgets"
					:key="budget.id"
					:budget="budget"
					@edit="(id) => onEditBudget(String(id))"
					@delete="(id) => onDeleteBudget(String(id))"
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import BudgetChart from '~/components/BudgetChart.client.vue';
import BudgetModal from '~/components/BudgetModal.vue';
import { useI18n } from 'vue-i18n';
import type { BudgetResource, BudgetsResponse } from '../../utils/types/api';

definePageMeta({
	layout: 'dashboard',
});

const { t } = useI18n();
const appConfig = useAppConfig();
const budgets = ref<BudgetResource[]>([]);
const loading = ref<boolean>();

const fetchBudgets = async (): Promise<void> => {
	try {
		loading.value = true;

		const res = await $fetch<BudgetsResponse>(`${appConfig.api}/budgets`);
		budgets.value = res.data;
	}
	catch (err: unknown) {
		console.error('Failed to fetch budgets:', err);
		budgets.value = [];
	}
	finally {
		loading.value = false;
	}
};

const editBudget = async (id: string): Promise<void> => {
	try {
		loading.value = true;
		const res = await $fetch<BudgetsResponse>(`http://localhost:3001/v1/budgets/${id}`);
		budgets.value = res.data;
		console.log(budgets.value);
	}
	catch (err: unknown) {
		console.error('Failed to edit budget:', err);
	}
	finally {
		loading.value = false;
	}
};

const deleteBudget = async (id: string): Promise<void> => {
	try {
		loading.value = true;
		const res = await $fetch<BudgetsResponse>(`http://localhost:3001/v1/budgets/${id}`);
		budgets.value = res.data;
		console.log(budgets.value);
	}
	catch (err: unknown) {
		console.error('Failed to delete budget:', err);
	}
	finally {
		loading.value = false;
	}
};

const onEditBudget = async (id: string): Promise<void> => {
	await editBudget(id);
};

const onDeleteBudget = async (id: string): Promise<void> => {
	await deleteBudget(id);
};

const onBudgetCreated = async (): Promise<void> => {
	await fetchBudgets();
};

onMounted(async (): Promise<void> => {
	await Promise.all([
		fetchBudgets(),
	]);
});
</script>
