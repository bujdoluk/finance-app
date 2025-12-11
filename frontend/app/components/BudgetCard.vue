<template>
	<div class="bg-white p-8 flex flex-col gap-4 rounded">
		<div class="flex justify-between">
			<div>
				<UChip
					standalone
					inset
					size="2xl"
				/>
				{{ budget.attributes.name }}
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

		<div>{{ t('components.budgetCard.maximum', { maximum: budget.attributes.maximum_spending }) }}</div>

		<div>
			<UProgress
				v-model="value"
				size="xl"
			/>
		</div>

		<div class="flex justify-between">
			<div class="flex">
				<div>dsads</div>
				<div>
					<div>{{ t('components.budgetCard.spent') }}</div>
					<div>$25.00</div>
				</div>
			</div>
			<div class="flex">
				<div>dsads</div>
				<div>
					<div>{{ t('components.budgetCard.remaining') }}</div>
					<div>$25.00</div>
				</div>
			</div>
		</div>

		<div>
			<div class="flex justify-between bg-stone-100 rounded p-4">
				<div>{{ t('components.budgetCard.latestSpending') }}</div>
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

			<div class="flex justify-between bg-stone-100 p-4">
				<UUser
					name="John Doe"
					:avatar="{
						src: 'https://i.pravatar.cc/150?u=john-doe',
						icon: 'i-lucide-image',
					}"
				/>
				<div class="flex flex-col items-end">
					<div>${{ budget.attributes.amount }}</div>
					<div>{{ dayjs(budget.attributes.created_at).format("D MMM YYYY") }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';
import dayjs from 'dayjs';
import { ref } from 'vue';
import type { Budget } from '../../utils/types/api';

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
			emit('delete', props.budget.id);
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
