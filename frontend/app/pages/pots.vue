<template>
	<div class="w-full">
		<div class="flex justify-between">
			<div class="text-2xl text-black font-medium">
				Pots
			</div>
			<div>
				<UButton
					label="+ Add New Pot"
					color="neutral"
					size="xl"
				/>
			</div>
		</div>

		<div class="width">
			<Ucard>
				<div class="flex items-center justify-between w-full">
					<div class="flex items-center gap-2">
						<div>
							<UChip
								standalone
								inset
							/>
						</div>
						<div class="text-xl">
							Savings
						</div>
					</div>

					<div>
						<UButton
							color="neutral"
							variant="ghost"
							icon="i-solar:menu-dots-bold"
							class="cursor-pointer"
						/>
					</div>
				</div>

				<div class="flex items-center justify-between w-full py-2">
					<div>Total saved</div>
					<div class="text-2xl text-black font-bold">
						$159.00
					</div>
				</div>

				<UProgress v-model="value" />

				<div class="flex items-center justify-between w-full py-2">
					<div class="text-xs font-bold">
						73.3 %
					</div>
					<div class="text-sm">
						Target of $150
					</div>
				</div>

				<div class="flex justify-around w-full">
					<UButton
						label="+ Add Money"
						color="neutral"
						variant="outline"
						size="xl"
					/>
					<UButton
						label="Withdraw"
						color="neutral"
						variant="outline"
						size="xl"
					/>
				</div>
			</Ucard>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: 'dashboard',
});

const value = ref(50);
</script>

<style scoped>
.width {
  width: 300px;
}
</style>
