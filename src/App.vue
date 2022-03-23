<template>
  <div>
    <nav-bar />

    <div class="container-fluid h-100">
      <div class="row h-100">
        <div class="col-3 pt-3">
          <navigation
            :data-tag="data.tag"
            @routes-changed="updateRoutes"
          />
        </div>

        <div class="col-9 pt-3 mb-3">
          <router-view
            :http="data.http"
            :js="data.js"
            :data-tag="data.tag"
          />
        </div>
      </div>
    </div>

    <init-modal 
      @data="appendData"
      @set-tag="setTag"
    />

    <settings-modal />
  </div>
</template>

<script>
import Util from "./model/Util.js";

import InitModal from "./components/modals/InitModal.vue";
import SettingsModal from "./components/modals/SettingsModal.vue";

import NavBar from "./components/NavBar.vue";
import Navigation from "./components/Navigation.vue";

window.location.hash = "#/";

export default {
  name: "App",
  components: {
    InitModal,
    SettingsModal,
    Navigation,
    NavBar,
  },
  data: () => {
    return {
      data: {
        memoryLimit: 256 * 1000000,
        tag: Util.randomString(),
        http: [],
        js: [],
      }
    };
  },
  methods: {
    setTag(tag) {
      this.data.tag = tag;
    },
    appendData(chunk) {
      this.data.http.push(chunk.http);
      this.data.js.push(chunk.js);
    },
    updateRoutes: function (routes) {
      routes.forEach((route) => {
        this.$router.addRoute(route);
      });
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
