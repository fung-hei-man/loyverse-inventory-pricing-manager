import { defineStore } from 'pinia'

export const useStoreConfigStore = defineStore('store', {
  state: () => ({
    storeId: null,
    token: null,
  }),
  actions: {
    setStoreId(id) {
      this.storeId = id
      localStorage.setItem('loyverse_store_id', id)
    },
    getStoreId() {
      if (!this.storeId) {
        this.storeId = localStorage.getItem('loyverse_store_id')
      }
      return this.storeId
    },
    setToken(token) {
      this.token = token
      localStorage.setItem('loyverse_api_token', token)
    },
    getToken() {
      if (!this.token) {
        this.token = localStorage.getItem('loyverse_api_token')
      }
      return this.token
    }
  }
})
