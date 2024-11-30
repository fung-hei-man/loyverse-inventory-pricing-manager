<template>
  <v-container>
    <v-row>
      <v-col cols='12'>
        <v-card variant='elevated'>
          <v-card-title>成本計算器</v-card-title>
          <v-card-text>
            <v-form @submit.prevent='submitFinalPrice'>
              <v-row>
                <v-col cols='4'>
                  <v-text-field v-model.number='baseCost' label='基本成本' type='number' prefix='NT' outlined />
                </v-col>
                <v-col cols='4'>
                  <v-text-field v-model.number='manHour' label='工時' type='number' suffix='小時' outlined />
                </v-col>
                <v-col cols='4'>
                  <v-text-field v-model.number='weight' label='重量' type='number' suffix='公克' outlined />
                </v-col>
              </v-row>
              <v-checkbox v-model='isBonus' label='額外利潤' />

              <v-text-field v-model='totalCost' label='總成本' type='number' outlined readonly />
              <v-row>
                <v-col cols='4'>
                  <v-text-field v-model='price' label='成本加成定價' type='number' outlined />
                </v-col>
                <v-col cols='4'>
                  <v-text-field v-model='weightAdjustedPrice' label='重量加成後定價' type='number' outlined readonly />
                </v-col>
                <v-col cols='4'>
                  <v-text-field v-model='feeAdjustedPrice' label='重量＆手續費加成後定價' type='number' outlined readonly />
                </v-col>
              </v-row>
              <v-row class='d-flex align-center'>
                <v-col cols='4'>
                  <v-text-field v-model='finalPrice' label='最終定價' prepend-inner-icon='mdi-currency-usd' type='number' outlined />
                </v-col>
                <v-col class='d-flex' cols='4' :style="{ gap: '28px' }">
                  <v-btn color='primary' type='submit' :disabled='!isValidToSubmit'>
                    確認定價
                  </v-btn>
                  <v-btn color='secondary' type='button' @click='resetPricing' v-if='isValidToSubmit'>
                    重設定價
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { isNil } from 'lodash'

const baseCost = ref(0)
const manHour = ref(0)
const weight = ref(0)
const isBonus = ref(false)
const finalPrice = ref(0)

const markUpPercent = parseFloat(import.meta.env.VITE_MARKUP_PERCENT)
const extraMarkUpPercent = parseFloat(import.meta.env.VITE_EXTRA_MARKUP_PERCENT)
const txnFeePercent = parseFloat(import.meta.env.VITE_TXN_FEE_PERCENT)
const labourCostPerHour = parseFloat(import.meta.env.VITE_LABOR_COST_PER_HOUR)
const retouchCost = parseFloat(import.meta.env.VITE_RETOUCH_COST)
const transCost = parseFloat(import.meta.env.VITE_TRANSPOSTATION_COST)
const pricePerGram = parseFloat(import.meta.env.VITE_PRICE_PER_GRAM)
const extraPricePerGram = parseFloat(import.meta.env.VITE_EXTRA_PRICE_PER_GRAM)

const emit = defineEmits(['submit-price', 'reset-pricing']);

const totalCost = computed(() => {
  if (isNil(manHour.value) || isNil(baseCost.value)) return 0

  const labourCost = manHour.value * labourCostPerHour
  return baseCost.value + retouchCost + transCost + labourCost
});

const price = computed(() => {
  return isBonus.value ? totalCost.value * extraMarkUpPercent : totalCost.value * markUpPercent
})

const weightAdjustedPrice = computed(() => {
  if (isNil(weight.value)) return 0

  const weightCost = isBonus.value ? extraPricePerGram * weight.value : pricePerGram * weight.value
  return price.value + weightCost;
})

const feeAdjustedPrice = computed(() => {
  if (isNil(weightAdjustedPrice.value)) return 0

  return (weightAdjustedPrice.value * txnFeePercent).toFixed(2)
})

const isValidToSubmit = computed(() => {
  return finalPrice.value > 0;
});

const submitFinalPrice = () => {
  emit('submit-price', finalPrice.value);
};

const resetPricing = () => {
  baseCost.value = 0
  manHour.value = 0
  weight.value = 0
  isBonus.value = false
  finalPrice.value = 0
  emit('reset-pricing')
};

watch(feeAdjustedPrice, () => {
  if (!isNil(feeAdjustedPrice.value)) {
    finalPrice.value = Math.ceil(feeAdjustedPrice.value / 10) * 10
  }
})

</script>

<style lang="scss" scoped>
.calculator {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 500px;

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: bold;
    }

    input {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;

      &[readonly] {
        background-color: #f0f0f0;
      }
    }
  }

  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    input[type="checkbox"] {
      margin-right: 0.5rem;
    }
  }
}
</style>
