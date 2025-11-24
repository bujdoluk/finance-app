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
					Good morning, User
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
import { useI18n } from 'vue-i18n';
import * as locales from '@nuxt/ui/locale';

const locale = ref('en');

const { t } = useI18n();

const route = useRoute();

const nav = computed<NavigationMenuItem[]>(() => [
	{
		label: 'Docs',
		to: '/docs/getting-started',
		active: route.path.startsWith('/docs/getting-started'),
	},
	{
		label: 'Components',
		to: '/docs/components',
		active: route.path.startsWith('/docs/components'),
	},
	{
		label: 'Figma',
		to: 'https://go.nuxt.com/figma-ui',
		target: '_blank',
	},
	{
		label: 'Releases',
		to: 'https://github.com/nuxt/ui/releases',
		target: '_blank',
	},
]);

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
</script>
