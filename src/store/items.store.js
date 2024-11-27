import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAllItems } from '@/services/items.service.js'

export const useItemStore = defineStore('items', () => {
  const items = ref([])

  const getItems = async () => {
    items.value = await getAllItems()
  }
  return {
    items,
    getItems
  }
})
