<template>
  <div>
    <nav-bar 
      :data-loaded="loaded"
      @reset="reset"
    />

    <div class="container-fluid h-100">
      <div class="row h-100">
        <div class="col-3 pt-3">
          <navigation />
        </div>

        <div class="col-9 pt-3 mb-3">
          <router-view
            :data-loaded="loaded"
            :data-tag="tag"
          />
        </div>
      </div>
    </div>

    <init-modal 
      @data="setLoaded"
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
      tag: Util.randomString(),
      length: 0
    };
  },
  computed: {
    loaded() {
      return this.length > 0;
    }
  },
  methods: {
    setLoaded(data) {
      this.tag = data.tag;
      this.length = data.length;
    },
    reset() {
      window.location.reload();
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
