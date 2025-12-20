<template>
	<UCard class="bg-white shadow rounded-lg">
		<div class="flex items-center justify-between w-full">
			<div class="flex items-center gap-2">
				<div>
					<UChip
						standalone
						inset
						size="2xl"
					/>
				</div>
				<div class="text-xl">
					{{ props.pot.attributes.name }}
				</div>
			</div>

			<div class="justify-end">
				<UDropdownMenu
					:items="buttons"
					:content="{ align: 'start', side: 'bottom' }"
				>
					<UButton
						icon="i-solar:menu-dots-bold"
						color="neutral"
						variant="ghost"
						class="cursor-pointer"
					/>
				</UDropdownMenu>
			</div>
		</div>

		<div class="flex items-center justify-between w-full py-2">
			<div>{{ t('components.potCard.totalSaved') }}</div>
			<div class="text-4xl text-black font-bold">
				{{ `$${props.pot.attributes.total_saved}` }}
			</div>
		</div>

		<UProgress v-model="progress" />

		<div class="flex items-center justify-between w-full py-2">
			<div class="text-xs font-bold">
				{{ percentage }}%
			</div>
			<div class="text-sm">
				{{ t('components.potCard.target', { target: 150 }) }}
			</div>
		</div>

		<div class="flex justify-between w-full gap-2">
			<AddToPotModal
				:pot="pot"
				:modal-state="'deposit'"
			/>
			<AddToPotModal
				:pot="pot"
				:modal-state="'withdraw'"
			/>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Pot } from '~~/utils/types/api';
import AddToPotModal from './AddToPotModal.vue';
import type { DropdownMenuItem } from '@nuxt/ui';

definePageMeta({
	layout: 'dashboard',
});

const props = defineProps<{
	pot: Pot;
}>();

const emit = defineEmits<{
	(e: 'edit', id: number): void;
	(e: 'delete', value: string): void;
}>();

const { t } = useI18n();
const progress = computed(() => props.pot.attributes.total_saved / props.pot.attributes.target * 100);
const percentage = computed(() => Math.abs(progress.value).toFixed(2));

const buttons = computed<DropdownMenuItem[]>(() => [
	{
		label: t('components.potCard.delete'),
		onSelect(): void {
			emit('delete', props.pot.id.toString());
		},
	},
	{
		label: t('components.potCard.edit'),
		onSelect(): void {
			emit('edit', props.pot.id);
		},
	},
]);
</script>
