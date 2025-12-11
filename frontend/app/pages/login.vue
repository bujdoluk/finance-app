<template>
	<div class="min-h-screen flex items-center justify-center bg-beige-100">
		<div class="w-1/3 flex items-center justify-center">
			<NuxtImg
				src="/guy-chasing-money.jpg"
				alt="Login image"
				width="500"
				height="300"
			/>
		</div>

		<div class="w-2/3 flex items-center justify-center">
			<LoginForm />
		</div>
	</div>
</template>

<script setup lang="ts">
import LoginForm from '~/components/LoginForm.vue';
</script>
