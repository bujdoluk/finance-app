<template>
	<div class="bg-stone-100">
		<div class="flex justify-between items-center mb-4">
			<h2>Budgets</h2>

			<UButton
				label="+ Add New Budget"
				color="primary"
				@click="open"
			/>
		</div>

		<UCard>
			<ClientOnly>
				<BudgetChart />
			</ClientOnly>

			<BudgetSummary />
		</UCard>

		<UCard>
			<div>Entertaiment</div>

			<div>Maximum of 50.00</div>

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
		</UCard>
	</div>
</template>

<script setup lang="ts">
import BudgetChart from '~/components/BudgetChart.client.vue';
import BudgetModal from '~/components/BudgetModal.vue';

definePageMeta({
	layout: 'dashboard',
});

const overlay = useOverlay();
const modal = overlay.create(BudgetModal);

const open = () => {
	modal.open();
};
</script>
