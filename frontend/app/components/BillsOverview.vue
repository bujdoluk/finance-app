<template>
	<UCard>
		<div class="flex justify-between">
			<div class="text-xl">
				{{ t('components.billsOverview.title') }}
			</div>
			<DetailLink link="transactions" />
		</div>
		<div
			v-for="bill in props.bills"
			:key="bill.id"
		>
			<div class="flex justify-between">
				<div>{{ bill.attributes.name }}</div>
				<div>${{ bill.attributes.amount }}</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import type { Bill } from '../../utils/types/api';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
	bills: Bill[];
}>();

const { t } = useI18n();
</script>
