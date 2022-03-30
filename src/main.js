import { createApp } from "vue"
import App from "./App.vue"
import "bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"
import { createRouter, createWebHashHistory } from "vue-router"

import StaticRoutes from "./model/StaticRoutes.js"
import FeatureExtractor from "./model/FeatureExtractor.js";
import Base from "./components/Base.vue";
import { markRaw } from "vue";

import config from "./model/Settings.js";
import mitt from "mitt";

browser.storage.local.get("settings")
  .then((res) => {
    if (res.settings && res.settings.hasOwnProperty("darkMode")) {
      config.darkMode.handler(res.settings.darkMode);
    }
  });

const routes = StaticRoutes.concat(
  FeatureExtractor.features().map((f) => {
    let featureInfo = FeatureExtractor.info(f);
    return {
      path: "/" + f,
      label: featureInfo.title,
      component: markRaw(Base),
      props: () => {
        return {
          feature: f,
          featureInfo: featureInfo
        };
      },
    };
  })
);

var app = createApp(App)

var router = createRouter({ 
  history: createWebHashHistory(), 
  routes: routes 
});
app.use(router)

app.config.globalProperties.emitter = mitt();

app.mount("#app")