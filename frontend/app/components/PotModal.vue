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
				<UInput
					v-model="pot"
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
							{{ pot?.length }}/{{ maxLength }}
						</div>
					</template>
				</UInput>
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
const pot = ref<string>();
const maxLength = 15;

const colors = ref(['Green', 'Yellow', 'Cyan', 'Navy', 'Red', 'Purple', 'Turquoise']);
const color = ref('Green');

const value2 = ref(5);

const title = computed(() => {
	if (props.modalState === 'add') {
		return t('components.potModal.add.title');
	}
	else if (props.modalState === 'edit') {
		return t('components.potModal.edit.title');
	}
	else {
		return t('components.potModal.delete.title', { pot: pot.value });
	}
});

const description = computed(() => {
	if (props.modalState === 'add') {
		return t('components.potModal.add.description');
	}
	else if (props.modalState === 'edit') {
		return t('components.potModal.edit.description');
	}
	else {
		return t('components.potModal.delete.description');
	}
});

const footerButtonLabel = computed(() => {
	if (props.modalState === 'add') {
		return t('components.potModal.add.buttons.addPot');
	}
	else if (props.modalState === 'edit') {
		return t('components.potModal.edit.buttons.saveChanges');
	}
	else {
		return t('components.potModal.delete.buttons.confirmDeletion');
	}
});
</script>
