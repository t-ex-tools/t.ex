import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createRouter, createWebHashHistory } from 'vue-router'
import Overview from "./components/content/Overview.vue";
import { markRaw } from "vue";


var app = createApp(App)
var router = createRouter({ history: createWebHashHistory(), routes: [{
  path: "/",
  name: "Start",
  component: markRaw(Overview),
},] });

app.use(router)
app.mount('#app')