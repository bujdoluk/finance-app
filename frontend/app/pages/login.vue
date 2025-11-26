<template>
	<div class="min-h-screen flex items-center justify-center bg-stone-100">
		<div class="w-1/3 flex items-center justify-center">
			<NuxtImg
				src="../public/guy-chasing-money.jpg"
				:alt="t('pages.login.image')"
				width="500"
				height="300"
			/>
		</div>
		<div class="w-2/3 flex items-center justify-center">
			<UCard class="w-full max-w-[400px]">
				<UForm
					:schema="schema"
					:state="formState"
					class="space-y-4 w-full max-w-sm"
					@submit="onSubmit"
				>
					<h3>{{ t('pages.login.title') }}</h3>
					<UFormField
						:label="t('pages.login.email')"
						name="email"
					>
						<UInput
							v-model="formState.email"
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

					<p>
						{{ t('pages.login.question') }}
						<u><NuxtLink to="/sign-up">{{ t('pages.login.link') }}</NuxtLink></u>
					</p>
				</UForm>
			</UCard>
		</div>
	</div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const schema = z.object({
	email: z.string(),
	password: z.string().min(8),
});

const formState = reactive({
	email: undefined,
	password: undefined,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<typeof formState>) {
	toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' });
	console.log(event.data);
}
</script>
