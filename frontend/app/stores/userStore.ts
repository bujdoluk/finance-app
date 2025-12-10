import { defineStore } from 'pinia';
import type { AuthUser } from '~~/utils/types/api';

export const useUserStore = defineStore('user', () => {
	const user = ref<AuthUser['user'] | null>(null);
	const isLoggedIn = computed(() => !!user.value);

	const setUser = (data: AuthUser) => {
		user.value = data.user;
		const token = useCookie('jwt');
		token.value = data.token;
	};

	const logout = () => {
		user.value = null;
		const token = useCookie('jwt');
		token.value = null;
	};

	return {
		user,
		isLoggedIn,
		setUser,
		logout,
	};
});
