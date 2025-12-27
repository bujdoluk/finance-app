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

				<span
					v-if="amountError"
					class="text-xs text-secondary-red red mt-1"
				>
					{{ amountError }}
				</span>
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
import { useI18n } from 'vue-i18n';
import appConfig from '~/app.config';
import type { PotResource } from '~~/utils/types/api';

const props = defineProps<{
	modalState: 'deposit' | 'withdraw';
	pot: PotResource;
}>();

const emit = defineEmits<{
	(e: 'updated'): void;
}>();

const { t } = useI18n();
const open = ref<boolean>(false);
const loading = ref<boolean>(false);
const amount = ref<number | null>(null);
const amountError = ref<string | null>(null);

const title = computed((): string => {
	if (props.modalState === 'deposit') return t('components.AddToPotModal.deposit.title', { name: props.pot.attributes.name });
	return t('components.AddToPotModal.widthdraw.title', { name: props.pot.attributes.name });
});

const description = computed((): string => {
	if (props.modalState === 'deposit') return t('components.AddToPotModal.deposit.description');
	return t('components.AddToPotModal.widthdraw.description');
});

const footerButtonLabel = computed((): string => {
	if (props.modalState === 'deposit') return t('components.AddToPotModal.deposit.buttons.confirm');
	return t('components.AddToPotModal.widthdraw.buttons.confirm');
});

const endpoint = computed(() =>
	props.modalState === 'deposit'
		? `/pots/${props.pot.id}/deposit`
		: `/pots/${props.pot.id}/withdraw`,
);

const submit = async (): Promise<void> => {
	if (!amount.value || amount.value <= 0) return;

	try {
		loading.value = true;

		await $fetch(`${appConfig.api}${endpoint.value}`, {
			method: 'POST',
			body: { amount: amount.value },
		});

		emit('updated');
		open.value = false;
		amount.value = null;
	}
	catch (err: unknown) {
		amountError.value = null;

		const jsonApiError = (err as any)?.data?.errors?.[0]?.detail
			|| (err as any)?.response?._data?.errors?.[0]?.detail;

		if (jsonApiError) {
			amountError.value = jsonApiError;
		}
		else if (err instanceof Error) {
			amountError.value = err.message;
		}
		else {
			amountError.value = 'An unknown error occurred';
		}
	}
	finally {
		loading.value = false;
	}
};

watch(open, (): void => {
	if (open.value) {
		amountError.value = null;
		amount.value = null;
	}
});
</script>
