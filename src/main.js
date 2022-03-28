import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createRouter, createWebHashHistory } from 'vue-router'
import Overview from "./components/content/Overview.vue";
import { markRaw } from "vue";
import config from "./model/Settings.js";
import mitt from "mitt";

browser.storage.local.get("settings")
  .then((res) => {
    if (res.settings && res.settings.hasOwnProperty("darkMode")) {
      config.darkMode.handler(res.settings.darkMode);
    }
  })

var app = createApp(App)
var router = createRouter({ history: createWebHashHistory(), routes: [{
  path: "/",
  name: "Start",
  component: markRaw(Overview),
},] });

app.use(router)
app.config.globalProperties.emitter = mitt();

app.mount('#app')