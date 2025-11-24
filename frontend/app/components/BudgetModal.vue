<template>
	<UModal
		:modal="false"
		:overlay="true"
		:dismissible="false"
		:title="title"
		:description="description"
		:close="{
			color: 'primary',
			variant: 'outline',
			class: 'rounded-full',
		}"
		@update:model-value="emit('close')"
	>
		<template #body>
			<div class="flex flex-col gap-4 w-full">
				<USelect
					v-model="budgetCategory"
					:items="budgetCategories"
				/>
				<UInputNumber
					v-model="value2"
					orientation="vertical"
				/>
				<USelect
					v-model="color"
					:items="colors"
				/>
			</div>
		</template>

		<template #footer>
			<UButton
				:label="footerButtonLabel"
				color="primary"
				variant="outline"
				class="cursor-pointer"
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
	(e: 'close'): void;
}>();

const { t } = useI18n();

const budgetCategories = ref(['Entertainment', 'Rent', 'Food', 'Utilities', 'Insurance', 'Internet']);
const budgetCategory = ref('Entertainment');

const colors = ref(['Green', 'Yellow', 'Cyan', 'Navy', 'Red', 'Purple', 'Turquoise']);
const color = ref('Green');

const value2 = ref(5);

const title = computed(() => {
	if (props.modalState === 'add') {
		return t('components.modals.add.title');
	}
	else if (props.modalState === 'edit') {
		return t('components.modals.edit.title');
	}
	else {
		return t('components.modals.delete.title', { budgetCategory: budgetCategory.value });
	}
});

const description = computed(() => {
	if (props.modalState === 'add') {
		return t('components.modals.add.description');
	}
	else if (props.modalState === 'edit') {
		return t('components.modals.edit.description');
	}
	else {
		return t('components.modals.delete.description');
	}
});

const footerButtonLabel = computed(() => {
	if (props.modalState === 'add') {
		return t('components.modals.add.buttons.add');
	}
	else if (props.modalState === 'edit') {
		return t('components.modals.edit.buttons.saveChanges');
	}
	else {
		return t('components.modals.delete.buttons.confirmDeletion');
	}
});
</script>
