import pinia from '@wlydfe/pinia-plus'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 配置unocss
import 'virtual:uno.css'

// 配置全局样式
import '@/assets/styles/index.scss'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
