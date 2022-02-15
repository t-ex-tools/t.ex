import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import { createRouter, createWebHashHistory } from 'vue-router'

var app = createApp(App)
var router = createRouter({ history: createWebHashHistory(), routes: [] });

app.use(router)
app.mount('#app')