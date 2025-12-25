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
			:label="t('pages.pots.buttons.addNewPot')"
			color="neutral"
			class="cursor-pointer"
		/>
		<template #body>
			<div class="flex flex-col gap-4 w-full">
				<span class="text-xs font-medium">{{ t('components.potModal.add.potName') }}</span>
				<UInput
					v-model="potName"
					:maxlength="maxLength"
					aria-describedby="character-count"
					:ui="{ trailing: 'pointer-events-none' }"
				>
					<template #trailing>
						<div
							id="character-count"
							class="text-xs text-muted tabular-nums"
							aria-live="polite"
							role="status"
						>
							{{ potName?.length || 0 }}/{{ maxLength }}
						</div>
					</template>
				</UInput>

				<span class="text-xs font-medium">{{ t('components.potModal.add.target') }}</span>
				<UInputNumber
					v-model="target"
					orientation="vertical"
					class="cursor-pointer"
					placeholder="$"
					@input="validateTarget"
					@keydown.enter.prevent="submit"
				/>

				<span
					v-if="targetError"
					class="text-xs text-secondary-red red mt-1"
				>
					{{ targetError }}
				</span>

				<span class="text-xs font-medium">{{ t('components.potModal.add.theme') }}</span>
				<USelect
					v-model="theme"
					:items="themes"
					class="cursor-pointer"
					value-key="value"
				>
					<template #leading="{ modelValue, ui }">
						<UChip
							v-if="modelValue"
							:color="getChip(modelValue)?.color || 'neutral'"
							inset
							standalone
							:size="(ui.itemLeadingChipSize() as ChipProps['size'])"
							:class="ui.itemLeadingChip()"
						/>
					</template>
				</USelect>
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
import type { ThemeColor, ThemeSelectItem } from '../../utils/types/theme';

const props = defineProps<{
	modalState: 'add' | 'edit' | 'delete';
}>();

const emit = defineEmits<{
	(e: 'created'): void;
}>();

const { t } = useI18n();
const open = ref<boolean>(false);
const potName = ref<string>('');
const target = ref<number | undefined>();
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

const maxLength = 50;

const title = computed(() => {
	if (props.modalState === 'add') return t('components.potModal.add.title');
	if (props.modalState === 'edit') return t('components.potModal.edit.title');
	return t('components.potModal.delete.title', { pot: potName.value });
});

const description = computed(() => {
	if (props.modalState === 'add') return t('components.potModal.add.description');
	if (props.modalState === 'edit') return t('components.potModal.edit.description');
	return t('components.potModal.delete.description');
});

const footerButtonLabel = computed(() => {
	if (props.modalState === 'add') return t('components.potModal.add.buttons.addPot');
	if (props.modalState === 'edit') return t('components.potModal.edit.buttons.saveChanges');
	return t('components.potModal.delete.buttons.confirmDeletion');
});

const targetError = ref<string | null>(null);

const validateTarget = () => {
	if (target.value === null || target.value === undefined || target.value <= 0) {
		targetError.value = t('components.potModal.add.errorMessages.invalidTarget');
		return false;
	}
	targetError.value = null;
	return true;
};

const submit = async (): Promise<void> => {
	try {
		if (!validateTarget()) return;

		loading.value = true;
		await $fetch('http://localhost:3001/v1/pots', {
			method: 'POST',
			body: {
				name: potName.value,
				theme: theme.value,
				target: target.value,
			},
		});
		emit('created');
		open.value = false;
	}
	catch (err: unknown) {
		console.error('Failed to create pot:', err);
	}
	finally {
		loading.value = false;
	}
};

const onClose = (): void => {
	if (loading.value) return;
	open.value = false;
};
</script>
