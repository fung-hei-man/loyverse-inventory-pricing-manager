import '@/assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import pinia from '@/store/index.js'

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App)
  .use(pinia)
  .use(vuetify)
  .mount('#app')
