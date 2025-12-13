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
				/>
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
				@click="createBudget"
			/>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import type { SelectItem, ChipProps } from '@nuxt/ui';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
	modalState: 'add' | 'edit' | 'delete';
}>();

const emit = defineEmits<{
	(e: 'created'): void;
}>();

const { t } = useI18n();
const open = ref(false);
const budgetCategoryName = ref();
const loading = ref<boolean>(false);

const themes = ref([
	{
		label: 'Green',
		value: 'Green',
		chip: {
			color: 'secondary-green',
		},
	},
	{
		label: 'Yellow',
		value: 'Yellow',
		chip: {
			color: 'secondary-yellow',
		},
	},
	{
		label: 'Cyan',
		value: 'Cyan',
		chip: {
			color: 'secondary-cyan',
		},
	},
	{
		label: 'Navy',
		value: 'Navy',
		chip: {
			color: 'secondary-navy',
		},
	},
	{
		label: 'Red',
		value: 'Red',
		chip: {
			color: 'secondary-red',
		},
	},
	{
		label: 'Purple',
		value: 'Purple',
		chip: {
			color: 'secondary-purple',
		},
	},
	{
		label: 'Turquoise',
		value: 'Turquoise',
		chip: {
			color: 'other-turqoise',
		},
	},
	{
		label: 'Purple',
		value: 'Purple',
		chip: {
			color: 'secondary-purple',
		},
	},
	{
		label: 'Brown',
		value: 'Brown',
		chip: {
			color: 'other-brown',
		},
	},
	{
		label: 'Magenta',
		value: 'Magenta',
		chip: {
			color: 'other-magenta',
		},
	},
	{
		label: 'Blue',
		value: 'Blue',
		chip: {
			color: 'other-blue',
		},
	},
	{
		label: 'Navy Gray',
		value: 'Navy Gray',
		chip: {
			color: 'other-navy-gray',
		},
	},
	{
		label: 'Army Green',
		value: 'Army Green',
		chip: {
			color: 'other-army-green',
		},
	},
	{
		label: 'Pink',
		value: 'Pink',
		chip: {
			color: 'other-pink',
		},
	},
	{
		label: 'Gold',
		value: 'Gold',
		chip: {
			color: 'other-gold',
		},
	},
	{
		label: 'Orange',
		value: 'Orange',
		chip: {
			color: 'other-orange',
		},
	},
] satisfies SelectItem[]);

const theme = ref(themes.value[0]?.value);

const getChip = (color: string) => {
	return themes.value.find(theme => theme.value === color)?.chip;
};

const maximumSpending = ref();

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

const createBudget = async (): Promise<void> => {
	try {
		loading.value = true;
		await $fetch('http://localhost:3001/v1/budgets', {
			method: 'POST',
			body: {
				name: budgetCategoryName.value,
				maximum_spending: maximumSpending.value,
				theme: theme.value,
				amount: 10,
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
</script>
