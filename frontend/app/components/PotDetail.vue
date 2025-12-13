<template>
	<div class="bg-white p-4 shadow rounded">
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

			<div>
				<UButton
					color="neutral"
					variant="ghost"
					size="sm"
					icon="i-solar:menu-dots-bold"
					class="cursor-pointer"
				/>
			</div>
		</div>

		<div class="flex items-center justify-between w-full py-2">
			<div>{{ t('components.potDetail.totalSaved') }}</div>
			<div class="text-2xl text-black font-bold">
				{{ `$${props.pot.attributes.total_saved}` }}
			</div>
		</div>

		<UProgress v-model="progress" />

		<div class="flex items-center justify-between w-full py-2">
			<div class="text-xs font-bold">
				{{ percentage }}%
			</div>
			<div class="text-sm">
				{{ t('components.potDetail.target', { target: 150 }) }}
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
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Pot } from '~~/utils/types/api';
import AddToPotModal from './AddToPotModal.vue';

definePageMeta({
	layout: 'dashboard',
});

const { t } = useI18n();

const props = defineProps<{
	pot: Pot;
}>();

const progress = computed(() => props.pot.attributes.total_saved / props.pot.attributes.target * 100);
const percentage = computed(() => Math.abs(progress.value).toFixed(2));
</script>
