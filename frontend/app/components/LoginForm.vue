<template>
	<div class="flex flex-col items-center justify-center gap-4 p-4">
		<OverlayModal ref="overlay" />

		<UPageCard class="w-full w-500 max-w-md">
			<UAuthForm
				:schema="schema"
				:fields="fields"
				:title="t('components.loginForm.title')"
				:providers="providers"
				icon="i-lucide-lock"
				:submit="{
					label: t('components.loginForm.title'),
					color: 'gray-900',
					variant: 'solid',
					class: 'cursor-pointer',
				}"
				:separator="{
					icon: 'i-lucide-user',
				}"
				@submit="onSubmit"
			>
				<template #providers>
					<div class="flex flex-col gap-2">
						<UButton
							v-for="provider in providers"
							:key="provider.label"
							variant="solid"
							icon="i-simple-icons-google"
							class="w-full justify-center cursor-pointer bg-gray-900 text-white hover:bg-gray-500"
							@click="provider.onClick"
						>
							{{ provider.label }}
						</UButton>
					</div>
				</template>

				<template #description>
					{{ t('components.loginForm.question') }}
					<NuxtLink
						to="/sign-up"
						class="text--color-gray-900 font-medium underline"
					>
						{{ t('components.loginForm.link') }}
					</NuxtLink>
				</template>

				<template #password-hint>
					<ULink
						to="#"
						class="text--color-gray-900 font-medium"
						tabindex="-1"
					>
						{{ t('components.loginForm.forgotPassword') }}
					</ULink>
				</template>

				<template #validation>
					<UAlert
						v-if="error"
						color="error"
						icon="i-lucide-info"
						:title="error"
					/>
				</template>

				<template #footer>
					{{ t('components.loginForm.message') }}
					<ULink
						to="#"
						class="text--color-gray-900 font-medium underline"
					>{{ t('components.loginForm.termsOfService') }}</ULink>.
				</template>
			</UAuthForm>
		</UPageCard>
	</div>
</template>

<script setup lang="ts">
import * as z from 'zod';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '~/stores/userStore';
import type { AuthUser } from '~~/utils/types/api';
import type OverlayModal from '~/components/OverlayModal.vue';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

const { t } = useI18n();
const router = useRouter();
const appConfig = useAppConfig();
const userStore = useUserStore();
const overlay = ref<typeof OverlayModal>();
const error = ref<string | null>(null);

const fields: AuthFormField[] = [
	{ name: 'email', color: 'gray-900', type: 'email', label: t('components.loginForm.email'), placeholder: 'Enter your email', required: true },
	{ name: 'password', color: 'gray-900', type: 'password', label: t('components.loginForm.password'), placeholder: 'Enter your password', required: true },
];

const providers = [
	{ label: 'Google', onClick: () => alert('Login with Google') },
];

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

type Schema = z.output<typeof schema>;

const onSubmit = async (payload: FormSubmitEvent<Schema>): Promise<void> => {
	overlay.value?.open();
	error.value = null;

	try {
		const res = await $fetch<AuthUser>(`${appConfig.api}/auth/login`, {
			method: 'POST',
			body: {
				email: payload.data.email,
				password: payload.data.password,
			},
		});

		userStore.setUser(res);
		await router.push('/overview');
	}
	catch (err: unknown) {
		console.error('Login failed:', err);
		error.value = t('components.loginForm.error');
	}
	finally {
		overlay.value?.close();
	}
};
</script>
