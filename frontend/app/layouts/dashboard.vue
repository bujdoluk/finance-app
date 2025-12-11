<template>
	<UDashboardGroup>
		<OverlayModal ref="overlay" />
		<UDashboardSidebar
			open
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

		<div class="w-full flex flex-col bg-beige-100">
			<UDashboardNavbar>
				<template #left>
					{{ t('layouts.dashboard.greeting', { timeOfDay, user: userStore.user?.first_name || '' }) }}
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
					<UButton
						color="neutral"
						variant="outline"
						active-variant="solid"
						class="cursor-pointer"
						@click="onLogout()"
					>
						Logout
					</UButton>
				</template>
			</UDashboardNavbar>

			<slot />
		</div>
	</UDashboardGroup>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/userStore';
import type { NavigationMenuItem } from '@nuxt/ui';
import * as locales from '@nuxt/ui/locale';
import { useI18n } from 'vue-i18n';
import type OverlayModal from '~/components/OverlayModal.vue';

const locale = ref('en');
const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const overlay = ref<typeof OverlayModal | null>(null);

const timeOfDay = computed(() => {
	const hour = new Date().getHours();
	if (hour >= 5 && hour < 12) return t('layouts.dashboard.morning');
	if (hour >= 12 && hour < 20) return t('layouts.dashboard.afternoon');
	return t('layouts.dashboard.evening');
});

const items = ref<NavigationMenuItem[][]>([
	[
		{ label: t('layouts.dashboard.navigation.overview'), icon: 'i-lucide-book-open', to: '/overview' },
		{ label: t('layouts.dashboard.navigation.transactions'), icon: 'i-tabler:arrows-sort', to: '/transactions' },
		{ label: t('layouts.dashboard.navigation.budgets'), icon: 'i-basil:chart-pie-solid', to: '/budgets' },
		{ label: t('layouts.dashboard.navigation.pots'), icon: 'i-solar:money-bag-bold', to: '/pots' },
		{ label: t('layouts.dashboard.navigation.reccuringBills'), icon: 'i-icon-park-outline:bill', to: '/reccuring-bills' },
	],
]);

const onLogout = async (): Promise<void> => {
	overlay.value?.open();
	userStore.logout();
	await router.push('/login');
	overlay.value?.close();
};
</script>
