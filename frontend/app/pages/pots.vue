<template>
  <div class="w-full">
    <div class="flex justify-between">
      <div>Pots</div>
      <div>
        <UButton 
          label="+ Add New Pot"
          color="primary"
        />
      </div>
    </div>

    <div class="width">
      <Ucard>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-2">
            <div><UChip standalone inset /></div>
            <div>Savings</div>
          </div>

            <div>...</div>
        </div>

        <div class="flex items-center justify-between w-full">
            <div>Total saved</div>
            <div>$159.00</div>
        </div>

        <UProgress v-model="value" />

        <div class="flex items-center justify-between w-full">
            <div>73.3%</div>
            <div>Target of $150</div>
        </div>

        <div class="flex justify-around w-full">
          <UButton    
            label="+ Add Money"
            color="primary" 
          />
          <UButton     
            label="+ Withdraw"
            color="primary"
          />
        </div>
      </Ucard>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
})

const value = ref(50)
</script>

<style scoped>
.width {
  width: 300px;
}
</style>