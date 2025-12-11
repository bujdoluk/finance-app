import { defineStore } from 'pinia';
import type { AuthUser } from '~~/utils/types/api';
import appConfig from '~/app.config';

export const useUserStore = defineStore('user', () => {
	const user = useCookie<AuthUser['user'] | null>('user');
	const token = useCookie<AuthUser['token'] | null>('jwt');

	const isLoggedIn = computed(() => !!user.value && !!token.value);

	const setUser = (data: AuthUser): void => {
		user.value = data.user;
		token.value = data.token;
	};

	const logout = (): void => {
		user.value = null;
		token.value = null;
	};

	const fetchUser = async (): Promise<void> => {
		if (!token.value || !user.value?.id) return;

		try {
			const data = await $fetch<AuthUser>(`${appConfig.api}/users/${user.value.id}`, {
				headers: {
					Authorization: `Bearer ${token.value}`,
				},
			});

			user.value = data.user;
		}
		catch (err: unknown) {
			console.error('Failed to load user:', err);
			logout();
		}
	};

	return {
		user,
		token,
		isLoggedIn,
		setUser,
		logout,
		fetchUser,
	};
});
