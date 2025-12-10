<template>
	<div class="min-h-screen flex items-center justify-center bg-stone-100">
		<div class="w-1/3 flex items-center justify-center">
			<NuxtImg
				src="/guy-chasing-money.jpg"
				alt="Signup image"
				width="500"
				height="300"
			/>
		</div>
		<div class="w-2/3 flex items-center justify-center">
			<SignUpForm />
		</div>
	</div>
</template>

<script setup lang="ts">
import SignUpForm from '~/components/SignUpForm.vue';
</script>
