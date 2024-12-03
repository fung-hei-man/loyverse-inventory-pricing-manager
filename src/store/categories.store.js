import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as httpHelper from '@/helper/httpHelper.js'
import { pick } from 'lodash'

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref([])

  const getAllCategories = async () => {
    try {
      const result = await httpHelper.get('/categories');
      categories.value = result?.categories?.map((item) => pick(item, ['id', 'name']))

    } catch (err) {
      console.error(err);
      categories.value = [];
    }
  }

  return {
    categories,
    getAllCategories
  }
})
