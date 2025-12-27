<template>
	<UCard>
		<div class="flex justify-between pb-4">
			<div class="text-xl font-medium">
				{{ t('components.potsOverview.title') }}
				<UTooltip
					v-if="potsCount > CONSTANTS.MIN_POTS"
					:content="{
						align: 'center',
						side: 'top',
						sideOffset: 8,
					}"
					:text="t('components.potsOverview.morePots', { count: potsCount })"
				>
					<UBadge
						class="rounded-full mr-2"
						color="secondary-green"
					>
						+{{ potsCount }}
					</UBadge>
				</UTooltip>
			</div>
			<div class="flex">
				<DetailLink link="pots" />
			</div>
		</div>

		<div class="flex gap-4">
			<div class="flex w-1/2 bg-beige-100 rounded-lg p-4 gap-4">
				<div class="flex w-1/4 items-center justify-center">
					<PotsMoneyIcon class="text-secondary-green text-6xl" />
				</div>

				<div class="flex flex-col justify-around">
					<div>{{ t('components.potsOverview.total') }}</div>
					<div class="text-4xl font-bold">
						$850
					</div>
				</div>
			</div>
			<div class="grid flex-1 grid-cols-2 gap-2 max-h-40">
				<div
					v-for="pot in visiblePots"
					:key="pot.id"
					class="flex p-2"
				>
					<div>
						<USeparator
							orientation="vertical"
							class="h-12"
							size="lg"
							:color="themeHexToColorNameMap[pot.attributes.theme]"
						/>
					</div>
					<div class="ml-2">
						<div class="text-sm">
							{{ pot.attributes.name }}
						</div>
						<div class="font-medium">
							${{ Number(pot.attributes.amount).toFixed(2) }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import type { PotResource } from '../../utils/types/api';
import { useI18n } from 'vue-i18n';
import PotsMoneyIcon from '../../public/pots-money.svg';
import { themeHexToColorNameMap } from '../../utils/types/theme';
import { CONSTANTS } from '../../utils/constants';

const props = defineProps<{
	pots: PotResource[];
}>();

const { t } = useI18n();
const visiblePots = computed((): PotResource[] => props.pots.slice(0, CONSTANTS.MAX_POTS_DISPLAYED));
const potsCount = computed((): number => props.pots.length - CONSTANTS.MAX_POTS_DISPLAYED);
</script>
