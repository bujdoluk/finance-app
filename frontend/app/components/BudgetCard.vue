<template>
	<UCard class="min-h-80">
		<div class="flex justify-between">
			<div class="flex items-center">
				<UChip
					standalone
					inset
					size="2xl"
					:color="themeHexToColorNameMap[budget.attributes.theme]"
					class="pr-2"
				/>
				<div class="font-bold text-xl">
					{{ budget.attributes.name }}
				</div>
			</div>

			<div class="justify-end">
				<UDropdownMenu
					:items="buttons"
					:content="{ align: 'start', side: 'bottom' }"
				>
					<UButton
						icon="i-solar:menu-dots-bold"
						color="neutral"
						variant="ghost"
						class="cursor-pointer"
					/>
				</UDropdownMenu>
			</div>
		</div>

		<div class="py-1">
			{{ t('components.budgetCard.maximum', { maximum: budget.attributes.maximum_spending }) }}
		</div>

		<UProgress
			v-model="value"
			size="xl"
			class="py-1"
			:color="themeHexToColorNameMap[budget.attributes.theme]"
		/>

		<div class="flex py-1">
			<div class="flex w-1/2">
				<div>
					<USeparator
						orientation="vertical"
						class="h-12 pr-2"
						size="lg"
						:color="themeHexToColorNameMap[budget.attributes.theme]"
					/>
				</div>
				<div>
					<div class="text-sm">
						{{ t('components.budgetCard.spent') }}
					</div>
					<div class="font-medium text-xl">
						${{ Number(budget.attributes.amount).toFixed(2) }}
					</div>
				</div>
			</div>
			<div class="flex">
				<div>
					<USeparator
						orientation="vertical"
						class="h-12 pr-2"
						size="lg"
						color="neutral"
					/>
				</div>
				<div>
					<div class="text-sm">
						{{ t('components.budgetCard.remaining') }}
					</div>
					<div class="font-medium text-xl">
						${{ Number(budget.attributes.amount).toFixed(2) }}
					</div>
				</div>
			</div>
		</div>

		<div class="bg-beige-100 rounded-lg">
			<div class="flex justify-between p-4">
				<div class="text-md font-bold">
					{{ t('components.budgetCard.latestSpending') }}
				</div>
				<div>
					<UButton
						label="See All"
						trailing-icon="i-material-symbols-light:chevron-right-rounded"
						size="xs"
						color="neutral"
						variant="ghost"
						class="cursor-pointer"
					/>
				</div>
			</div>

			<div class="flex justify-between bg-beige-100 p-4">
				<UUser
					name="John Doe"
					:avatar="{
						src: 'https://i.pravatar.cc/150?u=john-doe',
						icon: 'i-lucide-image',
					}"
				/>
				<div class="flex flex-col items-end">
					<div>${{ budget.attributes.amount }}</div>
					<div class="text-xs text--color-gray-900">
						{{ dayjs(budget.attributes.created_at).format("D MMM YYYY") }}
					</div>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';
import dayjs from 'dayjs';
import { ref } from 'vue';
import type { Budget } from '../../utils/types/api';
import { themeHexToColorNameMap } from '../../utils/types/theme';

const props = defineProps<{
	budget: Budget;
	items: DropdownMenuItem[];
	value?: number;
}>();

const emit = defineEmits<{
	(e: 'edit', id: number): void;
	(e: 'delete', value: string): void;
}>();

const { t } = useI18n();
const value = ref(props.value ?? 50);

const buttons = computed<DropdownMenuItem[]>(() => [
	{
		label: t('components.budgetCard.delete'),
		onSelect(): void {
			emit('delete', props.budget.id.toString());
		},
	},
	{
		label: t('components.budgetCard.edit'),
		onSelect(): void {
			emit('edit', props.budget.id);
		},
	},
]);
</script>
