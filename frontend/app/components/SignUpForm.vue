<template>
	<div class="flex flex-col items-center justify-center gap-4 p-4">
		<OverlayModal ref="overlay" />

		<UPageCard class="w-full w-500 max-w-md">
			<UAuthForm
				:schema="schema"
				:fields="fields"
				:title="t('components.signUpForm.createAccount')"
				icon="i-lucide-user-plus"
				:submit="{
					label: t('components.signUpForm.submit'),
					color: 'gray-900',
					variant: 'solid',
					class: 'cursor-pointer',
				}"
				@submit="onSubmit"
			>
				<template #password-hint>
					<UButton
						color="neutral"
						variant="link"
						size="sm"
						class="cursor-pointer"
						:aria-label="show ? 'Hide password' : 'Show password'"
						:aria-pressed="show"
						@click="show = !show"
					/>
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
					{{ t('components.signUpForm.question') }}
					<NuxtLink
						to="/login"
						class="text--color-gray-900 font-medium underline"
					>
						{{ t('components.signUpForm.link') }}
					</NuxtLink>
				</template>
			</UAuthForm>
		</UPageCard>
	</div>
</template>

<script setup lang="ts">
import * as z from 'zod';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import type OverlayModal from '~/components/OverlayModal.vue';
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui';

const { t } = useI18n();
const router = useRouter();
const appConfig = useAppConfig();
const overlay = ref<typeof OverlayModal>();
const show = ref(false);
const error = ref<string | null>(null);

const fields: AuthFormField[] = [
	{ name: 'name', color: 'gray-900', type: 'text', label: t('components.signUpForm.name'), placeholder: 'John Doe', required: true },
	{ name: 'email', color: 'gray-900', type: 'email', label: t('components.signUpForm.email'), placeholder: 'john.doe@gmail.com', required: true },
	{ name: 'password', color: 'gray-900', type: 'password', label: t('components.signUpForm.password'), placeholder: 'Password', required: true },
];

const schema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Invalid email'),
	password: z.string().min(8, 'Password must be at least 8 characters'),
});

type Schema = z.output<typeof schema>;

const onSubmit = async (payload: FormSubmitEvent<Schema>): Promise<void> => {
	overlay.value?.open();
	error.value = null;

	try {
		await $fetch(`${appConfig.api}/auth/sign-up`, {
			method: 'POST',
			body: {
				first_name: payload.data.name.split(' ')[0] || '',
				last_name: payload.data.name.split(' ')[1] || '',
				email: payload.data.email,
				password: payload.data.password,
			},
		});

		await router.push('/login');
	}
	catch (err: unknown) {
		console.error('signUpForm failed:', err);
		error.value = t('components.signUpForm.error') || 'signUpForm failed';
	}
	finally {
		overlay.value?.close();
	}
};
</script>
