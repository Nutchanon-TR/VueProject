import './assets/main.css'
import { createPinia } from 'pinia'; // นำเข้า Pinia
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)


app.use(createPinia()); // ใช้ Pinia ในแอป
app.use(router)

app.mount('#app')
