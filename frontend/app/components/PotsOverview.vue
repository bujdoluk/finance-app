<template>
	<UCard class="p-2">
		<div class="flex justify-between">
			<div class="text-xl">
				{{ t('components.potsOverview.title') }}
			</div>
			<DetailLink link="pots" />
		</div>

		<div class="flex">
			<div class="flex w-1/2">
				<div class="mr-2">
					icon
				</div>
				<div class="flex flex-col">
					<div>Total Saved</div>
					<div class="text-2xl font-bold">
						$850
					</div>
				</div>
			</div>
			<div class="flex w-1/2 flex-wrap gap-2 max-h-40 overflow-y-auto">
				<div
					v-for="pot in props.pots"
					:key="pot.id"
					class="flex p-2"
				>
					<div>
						<USeparator
							orientation="vertical"
							class="h-12"
							size="lg"
							color="primary"
						/>
					</div>
					<div class="ml-2">
						<div>{{ pot.attributes.name }}</div>
						<div>${{ pot.attributes.amount }}</div>
					</div>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import type { Pot } from '../../utils/types/api';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
	pots: Pot[];
}>();

const { t } = useI18n();
</script>
