import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import { registerNuiListener } from './nui/nuiListener.js'
import 'vue3-perfect-scrollbar/style.css';

import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(PerfectScrollbarPlugin)

registerNuiListener()
app.mount('#app')
