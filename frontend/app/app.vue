<template>
	<NuxtLayout>
		<TooltipProvider
			:delay-duration="800"
			:skip-delay-duration="500"
		>
			<UApp>
				<NuxtPage />
			</UApp>
		</TooltipProvider>
	</NuxtLayout>
</template>

<script setup>
import { TooltipProvider } from 'reka-ui';
</script>
