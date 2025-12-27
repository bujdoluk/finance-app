<template>
	<UDashboardGroup>
		<OverlayModal ref="overlay" />
		<UDashboardSidebar
			open
			class="bg-gray-900"
		>
			<template #header>
				<div>
					<NuxtImg
						src="../../public/finance.png"
						alt="Finance app logo"
					/>
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
import { useI18n } from 'vue-i18n';
import type OverlayModal from '~/components/OverlayModal.vue';
import { CONSTANTS } from '~~/utils/constants';

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const overlay = ref<typeof OverlayModal | null>(null);

const timeOfDay = computed(() => {
	const hour = new Date().getHours();
	if (hour >= CONSTANTS.MORNING_START && hour < CONSTANTS.MORNING_END) return t('layouts.dashboard.morning');
	if (hour >= CONSTANTS.AFTERNOON_START && hour < CONSTANTS.AFTERNOON_END) return t('layouts.dashboard.afternoon');
	return t('layouts.dashboard.evening');
});

const items = ref<NavigationMenuItem[][]>([
	[
		{ label: t('layouts.dashboard.navigation.overview'), icon: 'i-lucide-book-open', to: '/overview', class: 'p-4' },
		{ label: t('layouts.dashboard.navigation.transactions'), icon: 'i-tabler:arrows-sort', to: '/transactions', class: 'p-4' },
		{ label: t('layouts.dashboard.navigation.budgets'), icon: 'i-basil:chart-pie-solid', to: '/budgets', class: 'p-4' },
		{ label: t('layouts.dashboard.navigation.pots'), icon: 'i-solar:money-bag-bold', to: '/pots', class: 'p-4' },
		{ label: t('layouts.dashboard.navigation.bills'), icon: 'i-icon-park-outline:bill', to: '/bills', class: 'p-4' },
	],
]);

const onLogout = async (): Promise<void> => {
	overlay.value?.open();
	userStore.logout();
	await router.push('/login');
	overlay.value?.close();
};
</script>
