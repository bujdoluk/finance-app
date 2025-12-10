import { useUserStore } from '~/stores/userStore';

export default defineNuxtRouteMiddleware((to, _from) => {
	const userStore = useUserStore();

	const protectedRoutes = ['/overview', '/budgets', '/transactions', '/pots', '/reccuring-bills', '/users'];

	if (protectedRoutes.includes(to.path)) {
		if (!userStore.isLoggedIn) {
			return navigateTo('/login');
		}
	}
});
