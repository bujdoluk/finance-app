<template>
	<div
		v-if="visible"
		class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
	>
		<div class="bg-white p-6 rounded shadow-lg flex flex-col items-center gap-4">
			<slot>
				<p class="text-lg font-semibold">
					Loading...
				</p>
			</slot>
		</div>
	</div>
</template>

<script setup lang="ts">
const visible = ref(false);

const open = () => {
	visible.value = true;
};

const close = () => {
	visible.value = false;
};

defineExpose({ open, close });
</script>
