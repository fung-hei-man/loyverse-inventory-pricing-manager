<template>
  <v-container id='app-cntr'>

    <v-row justify='end'>
      <v-col cols='1'>
        <theme-toggle-btn />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols='12' md='6'>
        <v-select
          v-model='selectedCategoryId'
          :items='categoriesStore.categories'
          item-title='name'
          item-value='id'
          label='類別'
          @update:model-value='onCategoryChange'
        ></v-select>
      </v-col>

      <v-col cols='12' md='6'>
        <v-select
          v-model='selectedItemId'
          :items='filteredItems'
          item-title='item_name'
          item-value='id'
          label='變體'
          :disabled='!selectedCategoryId'
        ></v-select>
      </v-col>
    </v-row>

    <CostCalculator @submit-price='handleUpdateFinalPrice' />

    <v-row v-if='selectedItemId'>
      <v-col cols='12'>
        <v-data-table
          :headers='tableHeaders'
          :items='tableItems'
          :loading='isTableLoading'
          :items-per-page='25'
          class='elevation-1'
        >
          <template v-slot:loading>
            <v-skeleton-loader type='table-row@5' />
          </template>

          <template v-slot:item.action='{ item }'>
            <v-btn
              prepend-icon='mdi-store-plus'
              text='庫存＋＋'
              type='elevated'
              @click='addToVariant(item.raw.id)'/>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useItemStore } from '@/store/items.store.js'
import { logger } from '@/helper/logHelper.js'
import { useCategoryStore } from '@/store/categories.store.js'
import { isEmpty, isNil } from 'lodash'
import ThemeToggleBtn from '@/components/ThemeToggleBtn.vue'
import CostCalculator from '@/components/CostCalculator.vue'
import { getInventoriesOfVariants } from '@/services/items.service.js'

onMounted(async () => {
  logger.debug('=== App.vue onMounted ===')
  await useCategoryStore().getAllCategories()
  await useItemStore().getItems()
  logger.debug('=== App.vue onMounted Completed ===')
})
const itemStore = useItemStore();
const categoriesStore = useCategoryStore();

// ==========
// dropdown
// ==========
const selectedCategoryId = ref(null)
const selectedItemId = ref(null)
const selectedItem = ref(null)
const isTableLoading = ref(false)

const filteredItems = computed(() => {
  if (!selectedCategoryId.value) return []
  return itemStore.items.filter(item => item.category_id === selectedCategoryId.value)
})

const onCategoryChange = () => {
  selectedItemId.value = null
}

watch(selectedItemId, async (newValue, oldValue) => {
  isTableLoading.value = true

  let item = itemStore.items.find(item => item.id === newValue)
  let variantIds = item.variants.map(variant => variant.variant_id)

  let inventories = await getInventoriesOfVariants(variantIds)

  selectedItem.value = {
    ...item,
    variants: item.variants.map(variant => ({
      ...variant,
      inventory: inventories.get(variant.variant_id) || '／' // Default to 0 if no inventory found
    }))
  }

  isTableLoading.value = false
})


// ==========
// item table
// ==========
const tableHeaders = ref([
  { title: '品項', key: 'option1_value', sortable: true },
  { title: '成本', key: 'cost', sortable: true },
  { title: '售價', key: 'price', sortable: true },
  { title: '庫存', key: 'inventory', sortable: true },
  { title: '', key: 'action', sortable: false },
])

const tableItems = computed(() => {
  return selectedItem.value?.variants
    .filter(variant => variant.cost !== 0 && !isNil(variant.default_price))
    .map(variant => {
      return {
        option1_value: isEmpty(variant.option1_value) ? selectedItem.value.item_name : variant.option1_value,
        cost: `NT${ variant.cost }`,
        price: `NT${ variant.default_price }`,
        inventory: variant.inventory,
        id: variant.variant_id,
      }
    })
})

const addToVariant = async (variantId) => {
}

// ==========
// emits
// ==========
const handleUpdateFinalPrice = (price) => {
  console.log("Updated finalPrice:", price)
  finalPrice.value = price;
};

</script>

<style scoped>
#app-cntr {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
