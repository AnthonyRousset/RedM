import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerNuiListener } from './nui/nuiListener.js'

import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

registerNuiListener()
app.mount('#app')
