import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import { VueRouter } from 'vue-router'

const app = createApp(App)
app.use(VueRouter.createRouter({ routes: [] }))
app.mount('#app')
