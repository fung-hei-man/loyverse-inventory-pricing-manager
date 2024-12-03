<template>
  <v-dialog
      v-model='isModalVisible'
      persistent
      width='500'
  >
    <v-card>
      <v-card-title>設置 Loyverse 資料</v-card-title>
      <v-card-text>
        <v-text-field
            v-model='inputStoreId'
            label='請輸入 Loyverse 商店 ID'
            required
        />
        <v-text-field
            v-model='inputToken'
            label='請輸入 Loyverse Token'
            required
        />
      </v-card-text>
      <v-card-actions>
        <v-btn
            color='primary'
            @click='saveStoreId'
            :disabled='!inputStoreId'
        >
          儲存
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useStoreConfigStore } from '@/store/store.store.js'

const storeConfigStore = useStoreConfigStore()
const isModalVisible = ref(false)
const inputStoreId = ref('')
const inputToken = ref('')

const saveStoreId = () => {
  if (inputStoreId.value && inputStoreId.value) {
    storeConfigStore.setStoreId(inputStoreId.value)
    storeConfigStore.setToken(inputToken.value)

    isModalVisible.value = false
    window.location.reload()
  }
}

const checkAndShowModal = () => {
  const storedStoreId = storeConfigStore.getStoreId()
  const storedToken = storeConfigStore.getToken()

  if (!storedStoreId || !storedToken) {
    isModalVisible.value = true
  }
}

defineExpose({ checkAndShowModal })
</script>
