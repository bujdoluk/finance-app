<template>
  <div class="min-h-screen flex items-center justify-center bg-stone-100">
    <div class="w-1/3 flex items-center justify-center">
      <NuxtImg src="../public/guy-chasing-money.jpg" :alt="t('views.login.image')" width="500" height="300" />
    </div>
    <div class="w-2/3 flex items-center justify-center">
      <UCard class="w-full max-w-[400px]">
        <UForm :schema="schema" :state="formState" class="space-y-4 w-full max-w-sm" @submit="onSubmit">
          <h3>{{ t('views.login.title') }}</h3>
          <UFormField :label="t('views.login.email')" name="email">
            <UInput v-model="formState.email" class="w-full"/>
          </UFormField>
          
          <UFormField :label="t('views.login.password')" name="password">
            <UInput v-model="formState.password" type="password" class="w-full" />
          </UFormField>
          
          <UButton type="submit" class="bg-black w-full justify-center hover:bg-gray-800 active:bg-gray-800 cursor-pointer">
            {{ t('views.login.submit') }}
          </UButton>
          
          <p>
            {{ t('views.login.question') }}
            <u><NuxtLink to="/sign-up">{{ t('views.login.link') }}</NuxtLink></u>
          </p>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import Joi from 'joi'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const schema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .required()
})

const formState = reactive({
  email: undefined,
  password: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<typeof formState>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>