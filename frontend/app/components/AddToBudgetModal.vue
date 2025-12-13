<template>
	<UModal
		v-model:open="open"
		:overlay="true"
		:dismissible="false"
		:title="title"
		:description="description"
		:close="{
			color: 'neutral',
			variant: 'outline',
			class: 'rounded-full cursor-pointer',
		}"
		:ui="{ header: 'text-2xl' }"
	>
		<UButton
			:label="t('pages.budgets.buttons.addNewBudget')"
			color="neutral"
			class="cursor-pointer"
		/>

		<template #body>
			<div class="flex flex-col gap-2 w-full">
				<span class="text-xs font-medium">{{ t('components.budgetModal.add.amount') }}</span>
				<UInputNumber
					v-model="amount"
					orientation="vertical"
					class="cursor-pointer"
					placeholder="$"
				/>
			</div>
		</template>

		<template #footer>
			<UButton
				:label="footerButtonLabel"
				color="neutral"
				variant="solid"
				class="cursor-pointer w-full flex justify-center p-4"
				size="lg"
				:loading="loading"
				@click="updateBudget"
			/>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const props = defineProps<{
	modalState: 'add' | 'edit' | 'delete';
}>();

const emit = defineEmits<{
	(e: 'updated'): void;
}>();

const { t } = useI18n();
const open = ref(false);
const loading = ref<boolean>(false);
const amount = ref<number>();

const title = computed(() => {
	if (props.modalState === 'add') {
		return t('components.budgetModal.add.title');
	}
	else if (props.modalState === 'edit') {
		return t('components.budgetModal.edit.title');
	}
	else {
		return t('components.budgetModal.delete.title', { budgetCategory: budgetCategoryName.value });
	}
});

const description = computed(() => {
	if (props.modalState === 'add') {
		return t('components.budgetModal.add.description');
	}
	else if (props.modalState === 'edit') {
		return t('components.budgetModal.edit.description');
	}
	else {
		return t('components.budgetModal.delete.description');
	}
});

const footerButtonLabel = computed(() => {
	if (props.modalState === 'add') {
		return t('components.budgetModal.add.buttons.addBudget');
	}
	else if (props.modalState === 'edit') {
		return t('components.budgetModal.edit.buttons.saveChanges');
	}
	else {
		return t('components.budgetModal.delete.buttons.confirmDeletion');
	}
});

const updateBudget = async (): Promise<void> => {
	try {
		loading.value = true;
		await $fetch(`http://localhost:3001/v1/budgets/${props.budget}`, {
			method: 'PATCH',
			body: {
				amount: amount.value,
			},
		});
	}
	catch (err: unknown) {
		console.error('Failed to create budget:', err);
	}
	finally {
		loading.value = false;
		emit('updated');
		open.value = false;
	}
};
</script>
