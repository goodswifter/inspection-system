import { createApp } from 'vue'
import App from './App.vue'
// 配置unocss
import 'virtual:uno.css'
import 'element-plus/theme-chalk/el-message.css'

const app = createApp(App)

app.mount('#app')
