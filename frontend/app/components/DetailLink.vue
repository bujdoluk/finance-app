<template>
	<div class="flex">
		<ULink
			class="hover:underline align-center text-sm"
			:to="props.link"
		>
			{{ t('components.detailLink.title') }}
		</ULink>
		<UIcon
			name="i-lucide-chevron-right"
			class="size-3 mt-1 ml-2"
		/>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const props = defineProps<{
	link: string;
}>();

const { t } = useI18n();
</script>
