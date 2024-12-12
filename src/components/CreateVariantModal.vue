<template>
  <v-dialog
      v-model="localShow"
      max-width="500px"
      @update:model-value="$emit('update:show', $event)"
  >
    <v-card>
      <v-card-title>新增變體</v-card-title>
      <v-card-text>
        <v-text-field
            v-model="localVariant.name"
            label="名稱"
            required
        ></v-text-field>
        <v-text-field
            v-model.number="localVariant.cost"
            label="成本"
            type="number"
            required
        ></v-text-field>
        <v-text-field
            v-model.number="localVariant.price"
            label="售價"
            type="number"
            required
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="closeModal">取消</v-btn>
        <v-btn
            color="primary"
            @click="confirmCreate"
            :loading="isLoading"
        >
          確認
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStoreConfigStore } from '@/store/store.store.js'
import { createVariant } from '@/services/items.service.js'

const storeConfigStore = useStoreConfigStore()

const props = defineProps({
  show: Boolean,
  initialPrice: {
    type: Number,
    default: 0
  },
  initialCost: {
    type: Number,
    default: 0
  },
  selectedItemId: String
})

const emit = defineEmits(['update:show', 'on-created-variant'])

const localShow = ref(props.show)
const isLoading = ref(false)
const localVariant = ref({
  name: '',
  cost: props.initialCost,
  price: props.initialPrice
})

watch(() => props.show, (newVal) => {
  localShow.value = newVal
  if (newVal) {
    resetForm()
  }
})

const resetForm = () => {
  localVariant.value = {
    name: '',
    cost: props.initialCost,
    price: props.initialPrice
  }
}

const closeModal = () => {
  emit('update:show', false)
}

const confirmCreate = async () => {
  isLoading.value = true
  try {
    const storeId = storeConfigStore.getStoreId()

    const variant = {
      item_id: props.selectedItemId,
      option1_value: localVariant.value.name,
      cost: localVariant.value.cost,
      default_pricing_type: "FIXED",
      default_price: localVariant.value.price,
      stores: [
        {
          store_id: storeId,
          pricing_type: "FIXED",
          price: localVariant.value.price,
          available_for_sale: true
        }
      ]
    }

    await createVariant(variant)
    emit('on-created-variant')

    closeModal()

  } catch (error) {
    console.error('Error creating variant:', error)
  } finally {
    isLoading.value = false
  }
}
</script>
