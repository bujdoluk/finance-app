<template>
	<div class="bg-stone-100 w-full">
		<div class="text-3xl pb-8 font-medium">
			Overview
		</div>
		<ul>
			<li
				v-for="user in users"
				:key="user.id"
			>
				{{ user.name }} ({{ user.email }})
			</li>
		</ul>
		<div class="grid grid-cols-3">
			<div class="bg-black rounded-lg p-4 text-white ">
				<div class="text-sm">
					Current balance
				</div>
				<div class="text-3xl font-bold">
					$4,836.00
				</div>
			</div>

			<div class="bg-white rounded-lg p-4">
				<div class="text-sm">
					Income
				</div>
				<div class="text-3xl font-bold">
					$4,836.00
				</div>
			</div>

			<div class="bg-white rounded-lg p-4">
				<div class="text-sm">
					Expenses
				</div>
				<div class="text-3xl font-bold">
					$4,836.00
				</div>
			</div>
		</div>
		<div class="grid grid-cols-2">
			<div>
				<div>Pots</div>
				<div>Budgets</div>
				<div>Transactions</div>
				<div>Reccuring Bills</div>
			</div>

			<div class="width">
				<div class="flex justify-between">
					<div>Budgets</div>
					<div>See Details</div>
				</div>

				<div class="flex justify-between">
					<ClientOnly>
						<BudgetChart />
					</ClientOnly>

					<div class="flex flex-col">
						<div class="flex p-2">
							<div>
								<USeparator
									orientation="vertical"
									class="h-12"
									size="lg"
									color="primary"
								/>
							</div>
							<div>
								<div>Entertainment</div>
								<div>$50.00</div>
							</div>
						</div>

						<div class="flex p-2">
							<div>
								<USeparator
									orientation="vertical"
									class="h-12"
									size="lg"
									color="primary"
								/>
							</div>
							<div>
								<div>Entertainment</div>
								<div>$50.00</div>
							</div>
						</div>

						<div class="flex p-2">
							<div>
								<USeparator
									orientation="vertical"
									class="h-12"
									size="lg"
									color="primary"
								/>
							</div>
							<div>
								<div>Entertainment</div>
								<div>$50.00</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import BudgetChart from '~/components/BudgetChart.client.vue';

definePageMeta({
	layout: 'dashboard',
});

interface User {
	id: string;
	name: string;
	email: string;
}

const users = ref<Array<User>>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const config = useRuntimeConfig();

const fetchUsers = async () => {
	loading.value = true;
	error.value = null;
	try {
		// $fetch automatically handles JSON response
		users.value = await $fetch(`${config.public.apiBase}/users`);
	}
	catch (err) {
		error.value = 'Failed to fetch users.';
		console.error(err);
	}
	finally {
		loading.value = false;
	}
};

onMounted(() => {
	fetchUsers();
});
</script>

<style scoped>
.width {
	width: 400px;
}
</style>
