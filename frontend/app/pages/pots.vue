<template>
	<div class="w-full">
		<div class="flex justify-between">
			<div class="text-2xl text-black font-medium p-4">
				{{ t('pages.pots.title') }}
			</div>
			<div>
				<UButton
					:label="t('pages.pots.buttons.addNewPot')"
					color="neutral"
					size="xl"
				/>
			</div>
		</div>

		<div class="w-full flex gap-4 p-4">
			<div
				v-for="pot in pots"
				:key="pot.id"
				class="w-1/4 min-w-[300px]"
			>
				<PotDetail :pot="pot" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

definePageMeta({
	layout: 'dashboard',
});

const pots = [
	{
		id: 1,
		name: 'Savings',
		target: 2000,
		theme: 'primary',
		saved: 159,
	},
	{
		id: 2,
		name: 'Gift',
		target: 60,
		theme: 'primary',
		saved: 40,
	},
	{
		id: 2,
		name: 'Gift',
		target: 60,
		theme: 'primary',
		saved: 40,
	},
	{
		id: 2,
		name: 'Gift',
		target: 60,
		theme: 'primary',
		saved: 40,
	},
	{
		id: 2,
		name: 'Gift',
		target: 60,
		theme: 'primary',
		saved: 40,
	},
];
</script>
