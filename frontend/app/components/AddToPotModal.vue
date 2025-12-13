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
			:label="props.modalState === 'deposit'
				? t('components.AddToPotModal.deposit.buttons.deposit')
				: t('components.AddToPotModal.widthdraw.buttons.withdraw')"
			color="neutral"
			variant="ghost"
			size="xl"
			class="cursor-pointer bg-beige-100 w-1/2 justify-center"
		/>

		<template #body>
			<div class="flex flex-col gap-2 w-full">
				<span class="text-xs font-medium">{{
					props.modalState === 'deposit'
						? t('components.AddToPotModal.deposit.buttons.label')
						: t('components.AddToPotModal.widthdraw.buttons.label') }}</span>
				<UInput
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
				@click="updatePot"
			/>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Pot } from '~~/utils/types/api';

const props = defineProps<{
	modalState: 'deposit' | 'withdraw';
	pot: Pot;
}>();

const emit = defineEmits<{
	(e: 'updated'): void;
}>();

const { t } = useI18n();
const open = ref(false);
const loading = ref<boolean>(false);
const amount = ref<number>();

const title = computed(() => {
	if (props.modalState === 'deposit') {
		return t('components.AddToPotModal.deposit.title', { name: props.pot.attributes.name });
	}
	else {
		return t('components.AddToPotModal.widthdraw.title', { name: props.pot.attributes.name });
	}
});

const description = computed(() => {
	if (props.modalState === 'deposit') {
		return t('components.AddToPotModal.deposit.description');
	}
	return t('components.AddToPotModal.widthdraw.description');
});

const footerButtonLabel = computed(() => {
	if (props.modalState === 'deposit') {
		return t('components.AddToPotModal.deposit.buttons.confirm');
	}
	return t('components.AddToPotModal.widthdraw.buttons.confirm');
});

const updatePot = async (): Promise<void> => {
	try {
		loading.value = true;
		await $fetch(`http://localhost:3001/v1/pots/${props.pot.id}`, {
			method: 'PATCH',
			body: {
				amount: amount.value,
			},
		});
	}
	catch (err: unknown) {
		console.error('Failed to save to pot:', err);
	}
	finally {
		loading.value = false;
		emit('updated');
		open.value = false;
	}
};
</script>
