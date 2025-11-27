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

			<div class="bg-white w-2/3 p-4">
				<div>
					<UChip
						standalone
						inset
						size="2xl"
					/>
					Entertaiment
				</div>

				<div>{{ t('pages.budgets.maximumOf', { maximum: 50 }) }}</div>

				<div>
					<div>Spent</div>
					<div>remaininng</div>
				</div>

				<div>
					<div class="flex justify-between bg-stone-100">
						<div>Latest Spending</div>
						<div>
							See all <UButton
								icon="i-material-symbols-light:chevron-right-rounded"
								size="xs"
								color="primary"
								variant="solid"
								class="cursor-pointer"
							/>
						</div>
					</div>

					<div class="flex justify-between bg-stone-100">
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

					<div class="flex justify-between bg-stone-100">
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

definePageMeta({
	layout: 'dashboard',
});

const { t } = useI18n();
const overlay = useOverlay();
const modal = overlay.create(BudgetModal);

const open = () => {
	modal.open();
};
</script>
