import * as httpHelper from '@/helper/httpHelper.js'
import { pick } from 'lodash'

export const getAllItems = async () => {
  try {
    const response = await httpHelper.get('/items')

    return response?.items?.map((item) =>
      pick(item, ['id', 'category_id', 'item_name', 'variants'])
    )
  } catch (err) {
    console.error(err);
    return [];
  }
}

export const getInventoriesOfVariants = async (variantIds) => {
  try {
    const response = await httpHelper.get(`/inventory?variant_ids=${variantIds}`)

    return new Map(
      response?.inventory_levels?.map(inv => [inv.variant_id, inv.in_stock])
    );

  } catch (err) {
    console.error(err);
    return [];
  }
}
