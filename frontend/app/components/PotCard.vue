<template>
	<UCard class="bg-white shadow rounded-lg">
		<div class="flex items-center justify-between w-full">
			<div class="flex items-center gap-2">
				<div>
					<UChip
						standalone
						inset
						size="2xl"
						:color="themeHexToColorNameMap[props.pot.attributes.theme]"
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

		<div class="h-4 text-xs font-medium text-green-600 mt-1">
			<span :class="{ invisible: savedPercentage <= 100 }">
				{{ t('components.potCard.targetExceeded') }}
			</span>
		</div>

		<div class="flex items-center justify-between w-full py-2">
			<div class="text-xs font-bold">
				{{ percentage }}%
			</div>
			<div class="text-sm">
				{{ t('components.potCard.target', { target: props.pot.attributes.target }) }}
			</div>
		</div>

		<div class="flex justify-between w-full gap-2">
			<AddToPotModal
				:pot="pot"
				:modal-state="'deposit'"
				@updated="$emit('refresh')"
			/>
			<AddToPotModal
				:pot="pot"
				:modal-state="'withdraw'"
				@updated="$emit('refresh')"
			/>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { PotResource } from '~~/utils/types/api';
import AddToPotModal from './AddToPotModal.vue';
import type { DropdownMenuItem } from '@nuxt/ui';
import { themeHexToColorNameMap } from '../../utils/types/theme';

definePageMeta({
	layout: 'dashboard',
});

const props = defineProps<{
	pot: PotResource;
}>();

const emit = defineEmits<{
	(e: 'edit' | 'delete', id: number): void;
	(e: 'refresh'): void;
}>();

const { t } = useI18n();

const progress = computed(() => {
	const target = props.pot.attributes.target;
	const total_saved = props.pot.attributes.total_saved;
	if (!target || target <= 0) return 0;
	return Math.min((total_saved / target) * 100, 100);
});

const percentage = computed(() => Math.min((savedPercentage.value), 100).toFixed(2));

const savedPercentage = computed(() => {
	const target = props.pot.attributes.target;
	const total_saved = props.pot.attributes.total_saved;
	if (!target || target <= 0) return 0;
	return (total_saved / target) * 100;
});

const buttons = computed<DropdownMenuItem[]>(() => [
	{
		label: t('components.potCard.delete'),
		onSelect(): void {
			emit('delete', Number(props.pot.id));
		},
	},
	{
		label: t('components.potCard.edit'),
		onSelect(): void {
			emit('edit', Number(props.pot.id));
		},
	},
]);
</script>
