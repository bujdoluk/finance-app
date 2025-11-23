<template>
  <div class="min-h-screen flex items-center justify-center bg-stone-100">
    <div class="w-1/3 flex items-center justify-center">
      <NuxtImg src="../public/guy-chasing-money.jpg" :alt="t('views.signUp.image')" width="500" height="300" />
    </div>
    <div class="w-2/3 flex items-center justify-center">
      <UCard class="w-full max-w-[400px]">
        <UForm :schema="schema" :state="formState" class="space-y-4" @submit="onSubmit">
          <h3>{{ t('views.signUp.title') }}</h3>
          <UFormField :label="t('views.signUp.name')" name="name">
            <UInput 
              v-model="formState.name" 
              class="w-full"
              placeholder="John Doe" 
            />
          </UFormField>
          
          <UFormField :label="t('views.signUp.email')" name="email">
            <UInput 
              v-model="formState.email" 
              class="w-full"
              placeholder="john.doe@gmail.com" 
            />
          </UFormField>
          
          <UFormField :label="t('views.signUp.password')" name="password">
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
          
          <UButton type="submit" class="bg-black w-full justify-center hover:bg-gray-800 active:bg-gray-800 cursor-pointer">
            {{ t('views.signUp.submit') }}
          </UButton>
          
          <p>
            {{ t('views.signUp.question') }}
            <NuxtLink to="/login">{{ t('views.signUp.link') }}</NuxtLink>
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
const show = ref(false)

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .required()
})

const formState = reactive({
  name: undefined,
  email: undefined,
  password: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<typeof formState>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>