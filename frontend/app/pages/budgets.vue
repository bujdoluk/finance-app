<template>
	<div class="bg-stone-100">
		<div class="flex justify-between items-center p-4">
			<div class="text-xl">
				{{ t('pages.budgets.title') }}
			</div>

			<UButton
				label="+ Add New Budget"
				color="primary"
				@click="open"
			/>
		</div>

		<div class="flex gap-4 p-4 rounded">
			<div class="bg-white w-1/3 p-4">
				<ClientOnly>
					<BudgetChart />
				</ClientOnly>
			</div>

			<div class="bg-white w-2/3 p-8 flex flex-col gap-4">
				<div class="flex justify-between">
					<div>
						<UChip
							standalone
							inset
							size="2xl"
						/>
						Entertaiment
					</div>

					<div class="justify-end">
						<UDropdownMenu
							:items="items"
							:content="{
								align: 'start',
								side: 'bottom',
							}"
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

				<div>{{ t('pages.budgets.maximumOf', { maximum: 50 }) }}</div>

				<div>
					<UProgress
						v-model="value"
						size="xl"
					/>
				</div>

				<div class="flex justify-between">
					<div class="flex">
						<div>
							dsads
						</div>
						<div>
							<div>Spent</div>
							<div>$25.00</div>
						</div>
					</div>
					<div class="flex">
						<div>
							dsads
						</div>
						<div>
							<div>Free</div>
							<div>$25.00</div>
						</div>
					</div>
				</div>

				<div>
					<div class="flex justify-between bg-stone-100 rounded p-4">
						<div>Latest Spending</div>
						<div>
							<UButton
								label="See All"
								trailing-icon="i-material-symbols-light:chevron-right-rounded"
								size="xs"
								color="neutral"
								variant="ghost"
								class="cursor-pointer"
							/>
						</div>
					</div>

					<div class="flex justify-between bg-stone-100 p-4">
						<UUser
							name="John Doe"
							:avatar="{
								src: 'https://i.pravatar.cc/150?u=john-doe',
								icon: 'i-lucide-image',
							}"
						/>

						<div class="flex flex-col items-end">
							<div>-$5.00</div>
							<div>11 Aug 2024</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import BudgetChart from '~/components/BudgetChart.client.vue';
import BudgetModal from '~/components/BudgetModal.vue';
import { useI18n } from 'vue-i18n';
import type { DropdownMenuItem } from '@nuxt/ui';

definePageMeta({
	layout: 'dashboard',
});

const { t } = useI18n();
const overlay = useOverlay();
const modal = overlay.create(BudgetModal);

const open = () => {
	modal.open();
};

const value = ref(50);

const items = ref<DropdownMenuItem[]>([
	{
		label: 'Edit Budget',
	},
	{
		label: 'Delete Budget',
	},
]);
</script>
