<template>
  
  <UDashboardGroup>
    <UDashboardPanel resizable>
      <UDashboardSidebar >
        <NuxtImg src="../public/logo.jpg" :alt="t('views.dashboard.logo')" width="100" height="50" />
        <UNavigationMenu orientation="vertical" :items="items"  />
        <UDashboardSidebarCollapse class="cursor-pointer"/>
      </UDashboardSidebar>
      
      
      <template #header>
        <UDashboardNavbar title="Overview"/>
        
        <UDashboardToolbar />
      </template>
    </UDashboardPanel>
    
    <slot />

  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
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
