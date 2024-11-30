import * as httpHelper from '@/helper/httpHelper.js'

export const updateInventory = async (inventoryLevels) => {
  try {
    const response = await httpHelper.post(`/inventory`, { inventory_levels: inventoryLevels })

    return response.data
  } catch (error) {
    console.error('Inventory update failed:', error)
    throw error
  }
}
