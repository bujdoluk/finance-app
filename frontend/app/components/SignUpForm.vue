<template>
	<div class="relative">
		<OverlayModal ref="overlay" />
		<UCard class="w-full max-w-[400px] p-6">
			<UForm
				:schema="schema"
				:state="formState"
				class="space-y-4"
				@submit="onSubmit"
			>
				<h3 class="text-lg font-semibold">
					{{ t('pages.signUp.title') }}
				</h3>

				<UFormField
					:label="t('pages.signUp.name')"
					name="name"
				>
					<UInput
						v-model="formState.name"
						class="w-full"
						placeholder="John Doe"
					/>
				</UFormField>

				<UFormField
					:label="t('pages.signUp.email')"
					name="email"
				>
					<UInput
						v-model="formState.email"
						class="w-full"
						placeholder="john.doe@gmail.com"
					/>
				</UFormField>

				<UFormField
					:label="t('pages.signUp.password')"
					name="password"
				>
					<UInput
						v-model="formState.password"
						placeholder="Password"
						class="w-full"
						:type="show ? 'text' : 'password'"
						:ui="{ trailing: 'pe-1' }"
					>
						<template #trailing>
							<UButton
								color="neutral"
								variant="link"
								size="sm"
								class="cursor-pointer"
								:icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
								:aria-label="show ? 'Hide password' : 'Show password'"
								:aria-pressed="show"
								aria-controls="password"
								@click="show = !show"
							/>
						</template>
					</UInput>
				</UFormField>

				<UButton
					type="submit"
					class="bg-black w-full justify-center hover:bg-gray-800 active:bg-gray-800 cursor-pointer"
				>
					{{ t('pages.signUp.submit') }}
				</UButton>

				<p class="text-sm mt-2">
					{{ t('pages.signUp.question') }}
					<NuxtLink
						to="/login"
						class="underline"
					>
						{{ t('pages.signUp.link') }}
					</NuxtLink>
				</p>
			</UForm>
		</UCard>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { z } from 'zod';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import type OverlayModal from './OverlayModal.vue';

const { t } = useI18n();
const router = useRouter();
const appConfig = useAppConfig();
const show = ref<boolean>(false);
const overlay = ref<typeof OverlayModal>();

const schema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	password: z.string().min(8),
});

const formState = reactive({
	name: '',
	email: '',
	password: '',
});

const onSubmit = async (): Promise<void> => {
	try {
		overlay.value?.open();

		await $fetch(`${appConfig.api}/aut/sign-up`, {
			method: 'POST',
			body: {
				first_name: formState.name.split(' ')[0] || '',
				last_name: formState.name.split(' ')[1] || '',
				email: formState.email,
				password: formState.password,
			},
		});

		await router.push('/login');
	}
	catch (err: unknown) {
		console.error('Signup failed:', err);
	}
	finally {
		overlay.value?.close();
	}
};
</script>
