<template>
  
   <UDashboardGroup class="bg-stone-100">  
    <UDashboardSidebar open class="bg-black">
      <template #header>
        <div>
          Finance
        </div>
      </template>
      <UNavigationMenu orientation="vertical" :items="items" />
    </UDashboardSidebar>

    <UCard class="mx-4 my-4 flex w-full">
      <slot />
    </UCard>
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Overview',
      icon: 'i-lucide-book-open',
      to: '/overview'
    },
    {
      label: 'Transactions',
      icon: 'i-tabler:arrows-sort',
      to: '/transactions'
    },
    {
      label: 'Budgets',
      icon: 'i-basil:chart-pie-solid',
      to: '/budgets'
    },
    {
      label: 'Pots',
      icon: 'i-solar:money-bag-bold',
      to: '/pots'
    },
    {
      label: 'Reccuring Bills',
      icon: 'i-icon-park-outline:bill',
      to: '/reccuring-bills'
    },
  ],
])
</script>
