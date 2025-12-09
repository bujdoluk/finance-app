<template>
	<UCard class="w-full max-w-[400px] p-6">
		<UForm
			:schema="schema"
			:state="formState"
			class="space-y-4 w-full max-w-sm"
			@submit="onSubmit"
		>
			<h3 class="text-lg font-semibold">
				{{ t('pages.login.title') }}
			</h3>

			<UFormField
				:label="t('pages.login.email')"
				name="email"
			>
				<UInput
					v-model="formState.email"
					type="email"
					class="w-full"
				/>
			</UFormField>

			<UFormField
				:label="t('pages.login.password')"
				name="password"
			>
				<UInput
					v-model="formState.password"
					type="password"
					class="w-full"
				/>
			</UFormField>

			<UButton
				type="submit"
				class="bg-black w-full justify-center hover:bg-gray-800 active:bg-gray-800 cursor-pointer"
			>
				{{ t('pages.login.submit') }}
			</UButton>

			<p class="text-sm mt-2">
				{{ t('pages.login.question') }}
				<NuxtLink
					to="/sign-up"
					class="underline"
				>
					{{ t('pages.login.link') }}
				</NuxtLink>
			</p>
		</UForm>
	</UCard>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { useToast } from '@nuxt/ui';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();
const toast = useToast();

// Form validation schema
const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

// Form reactive state
const formState = reactive<{ email?: string; password?: string }>({
	email: undefined,
	password: undefined,
});

// Login submit handler
async function onSubmit() {
	try {
		const response = await $fetch('http://localhost:3000/users/login', {
			method: 'POST',
			body: {
				email: formState.email,
				password: formState.password,
			},
		});

		// @ts-ignore
		const token: string = response.token;

		// Save JWT in cookie (expires in 1 hour)
		Cookies.set('jwt', token, { expires: 1 / 24 });

		toast.add({
			title: 'Success',
			description: 'Logged in successfully!',
			color: 'success',
		});

		// Redirect after login
		router.push('/');
	}
	catch (err: any) {
		toast.add({
			title: 'Error',
			description: err?.data?.errors?.[0]?.detail || 'Invalid credentials',
			color: 'danger',
		});
	}
}
</script>
