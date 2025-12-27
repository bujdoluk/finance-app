<template>
	<UModal
		v-model:open="open"
		:overlay="true"
		:title="title"
		:description="description"
		:close="{
			color: 'neutral',
			variant: 'outline',
			class: 'rounded-full cursor-pointer',
		}"
		:ui="{ header: 'text-2xl' }"
		@keydown.esc.prevent="onClose"
	>
		<UButton
			:label="t('pages.budgets.buttons.addNewBudget')"
			color="neutral"
			class="cursor-pointer"
		/>

		<template #body>
			<div class="flex flex-col gap-2 w-full">
				<span class="text-xs font-medium">{{ t('components.budgetModal.add.budgetCategoryName') }}</span>
				<UInput
					v-model="budgetCategoryName"
					class="cursor-pointer"
				/>
				<span class="text-xs font-medium">{{ t('components.budgetModal.add.maximumSpend') }}</span>
				<UInputNumber
					v-model="maximumSpending"
					orientation="vertical"
					class="cursor-pointer"
					placeholder="$"
					@input="validateMaximumSpeding"
					@keydown.enter.prevent="submit"
				/>

				<span
					v-if="maximumSpendingError"
					class="text-xs text-secondary-red red mt-1"
				>
					{{ maximumSpendingError }}
				</span>
				<span class="text-xs font-medium">{{ t('components.budgetModal.add.theme') }}</span>
				<USelect
					v-model="theme"
					:items="themes"
					class="cursor-pointer"
					value-key="value"
				>
					<template #leading="{ modelValue, ui }">
						<UChip
							v-if="modelValue"
							v-bind="getChip(modelValue)"
							inset
							standalone
							:size="(ui.itemLeadingChipSize() as ChipProps['size'])"
							:class="ui.itemLeadingChip()"
						/>
					</template>
				</Uselect>
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
				@click="submit"
			/>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import type { ChipProps } from '@nuxt/ui';
import { useI18n } from 'vue-i18n';
import { CONSTANTS } from '~~/utils/constants';
import type { ThemeColor, ThemeSelectItem } from '~~/utils/types/theme';

const props = defineProps<{
	modalState: 'add' | 'edit' | 'delete';
}>();

const emit = defineEmits<{
	(e: 'created'): void;
}>();

const { t } = useI18n();
const appConfig = useAppConfig();
const open = ref<boolean>(false);
const budgetCategoryName = ref<string>();
const maximumSpending = ref<number | undefined>();
const loading = ref<boolean>(false);

const themes = ref<ThemeSelectItem[]>([
	{ label: 'Green', value: 'secondary-green', chip: { color: 'secondary-green' } },
	{ label: 'Yellow', value: 'secondary-yellow', chip: { color: 'secondary-yellow' } },
	{ label: 'Cyan', value: 'secondary-cyan', chip: { color: 'secondary-cyan' } },
	{ label: 'Navy', value: 'secondary-navy', chip: { color: 'secondary-navy' } },
	{ label: 'Red', value: 'secondary-red', chip: { color: 'secondary-red' } },
	{ label: 'Purple', value: 'secondary-purple', chip: { color: 'secondary-purple' } },
	{ label: 'Pink', value: 'other-pink', chip: { color: 'other-pink' } },
	{ label: 'Turquoise', value: 'other-turquoise', chip: { color: 'other-turquoise' } },
	{ label: 'Brown', value: 'other-brown', chip: { color: 'other-brown' } },
	{ label: 'Magenta', value: 'other-magenta', chip: { color: 'other-magenta' } },
	{ label: 'Blue', value: 'other-blue', chip: { color: 'other-blue' } },
	{ label: 'Navy Gray', value: 'other-navy-gray', chip: { color: 'other-navy-gray' } },
	{ label: 'Army Green', value: 'other-army-green', chip: { color: 'other-army-green' } },
	{ label: 'Gold', value: 'other-gold', chip: { color: 'other-gold' } },
	{ label: 'Orange', value: 'other-orange', chip: { color: 'other-orange' } },
]);

const theme = ref<ThemeColor>(themes.value[0]?.value ?? 'neutral');

const getChip = (color: ThemeColor) => {
	return themes.value.find(theme => theme.value === color)?.chip;
};

const title = computed(() => {
	if (props.modalState === 'add') return t('components.budgetModal.add.title');
	if (props.modalState === 'edit') return t('components.budgetModal.edit.title');
	return t('components.budgetModal.delete.title', { budgetCategory: budgetCategoryName.value });
});

const description = computed(() => {
	if (props.modalState === 'add') return t('components.budgetModal.add.description');
	if (props.modalState === 'edit') return t('components.budgetModal.edit.description');
	return t('components.budgetModal.delete.description');
});

const footerButtonLabel = computed(() => {
	if (props.modalState === 'add') return t('components.budgetModal.add.buttons.addBudget');
	if (props.modalState === 'edit') return t('components.budgetModal.edit.buttons.saveChanges');
	return t('components.budgetModal.delete.buttons.confirmDeletion');
});

const maximumSpendingError = ref<string | null>(null);

const validateMaximumSpeding = () => {
	if (maximumSpending.value === null || maximumSpending.value === undefined || maximumSpending.value <= CONSTANTS.MIN_BUDGETS) {
		maximumSpendingError.value = t('components.budgetModal.add.errorMessages.invalidMaximumSpending');
		return false;
	}
	maximumSpendingError.value = null;
	return true;
};

const submit = async (): Promise<void> => {
	try {
		if (!validateMaximumSpeding()) return;
		loading.value = true;
		await $fetch(`${appConfig.api}/budgets`, {
			method: 'POST',
			body: {
				name: budgetCategoryName.value,
				maximum_spending: maximumSpending.value,
				theme: theme.value,
			},
		});
	}
	catch (err: unknown) {
		console.error('Failed to create budget:', err);
	}
	finally {
		loading.value = false;
		emit('created');
		open.value = false;
	}
};

const onClose = (): void => {
	if (loading.value) return;
	open.value = false;
};
</script>
