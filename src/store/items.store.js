import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAllItems, getItemById } from '@/services/items.service.js'

export const useItemStore = defineStore('items', () => {
  const items = ref([])

  const getItems = async () => {
    items.value = await getAllItems()
  }

  const upsertItem = async (id) => {
    const newItem = await getItemById(id)
    const index = items.value.findIndex(item => item.id === id)

    if (index !== -1) {
      console.debug(`[store] Updated item ${newItem.item_name}`)

      items.value[index] = {
        ...items.value[index],
        ...newItem
      }
    } else {
      console.debug(`[store] Inserted item ${newItem.item_name}`)

      items.value.push(newItem)
    }
  }

  return {
    items,

    getItems,
    upsertItem
  }
})
