<template>
	<div class="bg-beige-100">
		<div class="flex justify-between items-center p-4">
			<div class="text-xl">
				{{ t('pages.pots.title') }}
			</div>
			<div>
				<PotModal
					:modal-state="'add'"
					@created="onPotCreated"
				/>
			</div>
		</div>

		<div class="w-full flex gap-4">
			<div
				v-for="pot in pots"
				:key="pot.id"
				class="w-1/2"
			>
				<PotDetail :pot="pot" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Pot } from '../../utils/types/api';
import PotModal from '~/components/PotModal.vue';

definePageMeta({
	layout: 'dashboard',
});

const { t } = useI18n();
const pots = ref<Pot[]>([]);
const loading = ref<boolean>(false);

const fetchPots = async (): Promise<void> => {
	try {
		loading.value = true;
		const data = await $fetch<Array<Pot>>('http://localhost:3001/v1/pots');
		pots.value = data;
		console.log(pots.value);
	}
	catch (err: unknown) {
		console.error('Failed to fetch pots:', err);
	}
	finally {
		loading.value = false;
	}
};

const onPotCreated = async (): Promise<void> => {
	await fetchPots();
};

onMounted(async (): Promise<void> => {
	await fetchPots();
});
</script>
