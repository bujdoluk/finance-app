<template>
	<OverlayModal ref="overlay" />
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
import { useUserStore } from '~/stores/userStore';
import type { AuthUser } from '~~/utils/types/api';
import type OverlayModal from '~/components/OverlayModal.vue';

const { t } = useI18n();
const router = useRouter();
const appConfig = useAppConfig();
const userStore = useUserStore();
const overlay = ref<typeof OverlayModal>();

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

const formState = reactive({
	email: '',
	password: '',
});

const onSubmit = async (): Promise<void> => {
	overlay.value?.open();

	try {
		const res = await $fetch<AuthUser>(`${appConfig.api}/auth/login`, {
			method: 'POST',
			body: formState,
		});

		userStore.setUser(res);
		await router.push('/overview');
	}
	catch (err: unknown) {
		console.error('Login failed:', err);
	}
	finally {
		overlay.value?.close();
	}
};
</script>
