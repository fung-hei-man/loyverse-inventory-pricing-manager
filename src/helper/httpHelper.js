import axios from 'axios'
import { logger } from '@/helper/logHelper.js'
import pinia from '@/store/index.js'
import { useStoreConfigStore } from '@/store/store.store.js'

const configStore = useStoreConfigStore(pinia)

const instance = axios.create({
  // baseURL: `http://localhost:${import.meta.env.VITE_BACKEND_PORT}`,
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
    logger.error(error.response)

  } else if (error.request) {
    // 沒有收到回應
    if (error?.code === 'ECONNABORTED') {
      logger.error('請求時間過長，取消請求')
    }
  } else {
    logger.error('Failed to send API', error.message)
  }
}

export const get = async (path) => {
  logger.http(`GET /loyverse${path}`)
  return await instance.get(`/loyverse${path}`)
}

export const del = async (path) => {
  logger.http(`DELETE /loyverse${path}`)
  return await instance.delete(`/loyverse${path}`)
}

export const put = async (path, body) => {
  logger.http(`PUT /loyverse${path}`)
  return await instance.put(`/loyverse${path}`, body)
}

export const post = async (path, body) => {
  logger.http(`POST /loyverse${path}`)
  return await instance.post(`/loyverse${path}`, body)
}
