import { useUserStore } from '~/stores/userStore';

export default defineNuxtPlugin(async (): Promise<void> => {
	const token = useCookie('jwt');
	const user = useCookie('user');
	const userStore = useUserStore();

	if (token.value && user.value.id) {
		try {
			await userStore.loadUser;
		}
		catch (err: unknown) {
			console.error('Failed to load user on app start', err);
			userStore.logout();
		}
	}
});
