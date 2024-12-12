import axios from 'axios'
import pinia from '@/store/index.js'
import { useStoreConfigStore } from '@/store/store.store.js'

const configStore = useStoreConfigStore(pinia)

const instance = axios.create({
  headers: {
    'Authorization': `Bearer ${configStore.getToken()}`,
    'Content-Type': 'application/json'
  },
  timeout: 15000
})

instance.interceptors.request.use(
  (req) => {
    return req
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response?.data
  },
  (error) => {
    errorHandler(error)
    return Promise.reject(error.response?.data)
  }
)

const errorHandler = (error) => {
  if (error.response) {
    console.error(error.response)

  } else if (error.request) {
    // 沒有收到回應
    if (error?.code === 'ECONNABORTED') {
      console.error('請求時間過長，取消請求')
    }
  } else {
    console.error('Failed to send API', error.message)
  }
}

export const get = async (path) => {
  console.log(`GET /loyverse${path}`)
  return await instance.get(`/loyverse${path}`)
}

export const del = async (path) => {
  console.log(`DELETE /loyverse${path}`)
  return await instance.delete(`/loyverse${path}`)
}

export const put = async (path, body) => {
  console.log(`PUT /loyverse${path}`)
  return await instance.put(`/loyverse${path}`, body)
}

export const post = async (path, body) => {
  console.log(`POST /loyverse${path}`)
  return await instance.post(`/loyverse${path}`, body)
}
