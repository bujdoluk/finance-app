import { useUserStore } from '~/stores/userStore';

export default defineNuxtRouteMiddleware(async (to): Promise<void> => {
	const userStore = useUserStore();
	const token = useCookie('jwt');

	const protectedRoutes = [
		'/overview',
		'/budgets',
		'/transactions',
		'/pots',
		'/reccuring-bills',
		'/users',
		'/health',
		'/perf',
	];

	if (protectedRoutes.includes(to.path)) {
		if (!userStore.user?.id && token.value) {
			try {
				await userStore.loadUser();
			}
			catch (err: unknown) {
				console.log('Failed to load user', err);
				userStore.logout();
			}
		}

		if (!userStore.isLoggedIn) {
			return navigateTo('/login');
		}
	}
});
