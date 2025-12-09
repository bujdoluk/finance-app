<template>
	<UDashboardGroup class="bg-stone-100">
		<UDashboardSidebar
			open
			class="bg-black"
		>
			<template #header>
				<div>
					Finance
				</div>
			</template>
			<UNavigationMenu
				orientation="vertical"
				:items="items"
			/>
		</UDashboardSidebar>

		<div class="w-full flex flex-col">
			<UDashboardNavbar>
				<template #left>
					{{ t('layouts.dashboard.greetingUsers') }}
				</template>

				<template #right>
					<ULocaleSelect
						v-model="locale"
						:locales="Object.values(locales)"
						class="w-48"
					/>
					<UColorModeButton />
					<UAvatar
						src="https://github.com/benjamincanac.png"
						:chip="{
							inset: true,
						}"
					/>
				</template>
			</UDashboardNavbar>

			<slot />
		</div>
	</UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import * as locales from '@nuxt/ui/locale';
import type { User } from '../../utils/types/api';

const locale = ref('en');
const { t } = useI18n();

const items = ref<NavigationMenuItem[][]>([
	[
		{
			label: 'Overview',
			icon: 'i-lucide-book-open',
			to: '/overview',
		},
		{
			label: 'Transactions',
			icon: 'i-tabler:arrows-sort',
			to: '/transactions',
		},
		{
			label: 'Budgets',
			icon: 'i-basil:chart-pie-solid',
			to: '/budgets',
		},
		{
			label: 'Pots',
			icon: 'i-solar:money-bag-bold',
			to: '/pots',
		},
		{
			label: 'Reccuring Bills',
			icon: 'i-icon-park-outline:bill',
			to: '/reccuring-bills',
		},
	],
]);

const user = ref<User | null>(null);

const fetchUser = async (id: string): Promise<void> => {
	try {
		const data = await $fetch(`http://localhost:3001/users/${id}`);
		if (data) {
			user.value = data;
		}
	}
	catch (err: unknown) {
		console.log(err);
	}
};

onMounted(async (): Promise<void> => {
	await fetchUser();
});
</script>
