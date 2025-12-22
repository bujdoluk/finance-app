<template>
	<div class="bg-beige-100 p-8 h-750 overflow-y-auto">
		<div class="flex justify-between items-center">
			<div class="text-3xl pb-8 font-medium">
				{{ t('pages.pots.title') }}
			</div>
			<div>
				<PotModal
					:modal-state="'add'"
					@created="onPotCreated"
				/>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			<PotCard
				v-for="pot in pots"
				:key="pot.id"
				:pot="pot"
				@edit="(id) => onEditPot(String(id))"
				@delete="(id) => onDeletePot(String(id))"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { PotResource, PotsResponse } from '../../utils/types/api';
import PotModal from '~/components/PotModal.vue';

definePageMeta({
	layout: 'dashboard',
});

const { t } = useI18n();
const pots = ref<PotResource[]>([]);
const loading = ref<boolean>(false);

const fetchPots = async (): Promise<void> => {
	try {
		loading.value = true;
		const res = await $fetch<PotsResponse>('http://localhost:3001/v1/pots');
		pots.value = res.data;
		console.log(pots.value);
	}
	catch (err: unknown) {
		console.error('Failed to fetch pots:', err);
	}
	finally {
		loading.value = false;
	}
};

const editPot = async (id: string): Promise<void> => {
	try {
		loading.value = true;
		const data = await $fetch<Array<PotResource>>(`http://localhost:3001/v1/pots/${id}`);
		pots.value = data;
		console.log(pots.value);
	}
	catch (err: unknown) {
		console.error('Failed to edit pot:', err);
	}
	finally {
		loading.value = false;
	}
};

const deletePot = async (id: string): Promise<void> => {
	try {
		loading.value = true;
		const res = await $fetch<PotsResponse>(`http://localhost:3001/v1/pots/${id}`);
		pots.value = res.data;
		console.log(pots.value);
	}
	catch (err: unknown) {
		console.error('Failed to delete pot:', err);
	}
	finally {
		loading.value = false;
	}
};

const onEditPot = async (id: string): Promise<void> => {
	await editPot(id);
};

const onDeletePot = async (id: string): Promise<void> => {
	await deletePot(id);
};

const onPotCreated = async (): Promise<void> => {
	await fetchPots();
};

onMounted(async (): Promise<void> => {
	await fetchPots();
});
</script>
