<template>
  <Analytics />

  <v-container v-if='isStoreConfigured' id='app-cntr'>
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
            :loading='isLoadingItems'
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
            :loading='isLoadingItems'
            :disabled='!selectedCategoryId'
        ></v-select>
      </v-col>
    </v-row>

    <CostCalculator
        @submit-price='handleUpdateFinalPrice'
        @reset-pricing='resetPricing'
    />

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
                :disabled='!isPricingConfirmed'
                :loading="isAddingInventory"
                @click='incrementInventory(item)'
            />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <v-alert type='error'>
      請先設置 Loyverse 資料
    </v-alert>
  </v-container>
  <StoreConfigModal ref='storeConfigModal' />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { isEmpty, isNil } from 'lodash'
import { Analytics } from '@vercel/analytics/vue'

import { useItemStore } from '@/store/items.store.js'
import { useCategoryStore } from '@/store/categories.store.js'
import { useStoreConfigStore } from '@/store/store.store.js'
import ThemeToggleBtn from '@/components/ThemeToggleBtn.vue'
import CostCalculator from '@/components/CostCalculator.vue'
import StoreConfigModal from '@/components/StoreConfigModal.vue'
import { getInventoriesOfVariants } from '@/services/items.service.js'
import { updateInventory } from '@/services/inventory.service.js'

const itemStore = useItemStore()
const categoriesStore = useCategoryStore()
const storeConfigStore = useStoreConfigStore()

const storeConfigModal = ref(null)
const isStoreConfigured = ref(false)
const isAddingInventory = ref(false)
const isLoadingItems = ref(false)

onMounted(async () => {
  console.debug('=== App.vue onMounted ===')
  isLoadingItems.value = true
  const storeId = storeConfigStore.getStoreId()
  const token = storeConfigStore.getToken()
  if (!storeId || !token) {
    storeConfigModal.value.checkAndShowModal()
    isStoreConfigured.value = false
  } else {
    isStoreConfigured.value = true
  }

  await useCategoryStore().getAllCategories()
  await useItemStore().getItems()

  isLoadingItems.value = false
  console.debug('=== App.vue onMounted Completed ===')
})


// ==========
// dropdown
// ==========
const selectedCategoryId = ref(null)
const selectedItemId = ref(null)
const selectedItem = ref(null)
const isTableLoading = ref(false)
const isPricingConfirmed = ref(false)
const finalPrice = ref(0)

const filteredItems = computed(() => {
  if (!selectedCategoryId.value) return []
  return itemStore.items.filter(item => item.category_id === selectedCategoryId.value)
})

const onCategoryChange = () => {
  selectedItemId.value = null
}

watch(selectedItemId, async (newValue) => {
  if (!newValue) return

  isTableLoading.value = true

  let item = itemStore.items.find(item => item.id === newValue)
  let variantIds = item.variants.map(variant => variant.variant_id)

  let inventories = await getInventoriesOfVariants(variantIds)

  selectedItem.value = {
    ...item,
    variants: item.variants.map(variant => ({
      ...variant,
      inventory: inventories.get(variant.variant_id) || 0 // Default to 0 if no inventory found
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

const incrementInventory = async (item) => {
  isAddingInventory.value = true
  try {
    const storeId = storeConfigStore.getStoreId()
    if (!storeId) {
      storeConfigModal.value.checkAndShowModal()
      return
    }

    const newInventory = item.inventory + 1
    console.debug('Updating inventory of ' + item.option1_value + '. ' + item.inventory + ' -> ' + newInventory)

    await updateInventory([{
      variant_id: item.id,
      store_id: storeId,
      stock_after: newInventory
    }])

    // Refresh inventory
    let variantIds = selectedItem.value.variants.map(variant => variant.variant_id)
    let inventories = await getInventoriesOfVariants(variantIds)

    selectedItem.value = {
      ...selectedItem.value,
      variants: selectedItem.value.variants.map(variant => ({
        ...variant,
        inventory: inventories.get(variant.variant_id) || 0
      }))
    }
  } catch (error) {
    console.error('Error adding to variant:', error)
  } finally {
    isAddingInventory.value = false
  }
}

// ==========
// emits
// ==========
const handleUpdateFinalPrice = (price) => {
  console.log("Updated finalPrice:", price)
  finalPrice.value = price;
  isPricingConfirmed.value = true;
};

const resetPricing = () => {
  isPricingConfirmed.value = false;
  finalPrice.value = 0;
};

</script>

<style scoped>
#app-cntr {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
