<template>
  <div>
    <nav-bar></nav-bar>

    <!--
    <tab-bar
      :groups="groups.default"
      :selected-index="selectedIndex"
      @tabs-changed="updateSelectedIndex"
      @tab-removed="groupAtIndexRemoved"
    >
    </tab-bar>
    -->

    <div class="container-fluid h-100">
      <div class="row h-100">
        <div class="col-2 pt-3">
          <navigation
            :groups="groups.default"
            :selected-index="selectedIndex"
            :data-tag="data.tag"
            @routes-changed="updateRoutes"
          >
          </navigation>
        </div>

        <div class="col-8 pt-3">
          <router-view :requests="data.requests" :js="js" :data-tag="dataTag">
          </router-view>
        </div>

        <div class="col-2 pt-3">
          <sidebar
            :requests="data.requests"
            :js="js"
            v-on:trigger-download="download"
          >
          </sidebar>
        </div>
      </div>
    </div>

    <init-modal 
      @data="appendData"
      @set-tag="setTag"
    >
    </init-modal>

    <settings-modal @create-password="createPassword">
    </settings-modal>
  </div>
</template>

<script>
import Util from "./model/Util.js";
import Statistics from "./model/Statistics.js";

import InitModal from "./components/modals/InitModal.vue";
import SettingsModal from "./components/modals/SettingsModal.vue";

import NavBar from "./components/NavBar.vue";
import Sidebar from "./components/Sidebar.vue";
import Navigation from "./components/Navigation.vue";

import defaultGroups from "./model/DefaultGroups.js";

export default {
  name: "App",
  components: {
    InitModal,
    SettingsModal,
    Sidebar,
    Navigation,
    NavBar,
  },
  data: () => {
    return {
      data: {
        memoryLimit: 256 * 1000000,
        tag: Util.randomString(),
        requests: [],
        js: [],
      },
      groups: {
        default: defaultGroups,
        selectedIndex: 0
      }
    };
  },
  methods: {
    setTag(tag) {
      this.data.tag = tag;
    },
    appendData(chunk) {
      this.data.requests.push(chunk.requests);
      this.data.js.push(chunk.js);
    },
    passData: function (source) {
      return source === "requests" ? this.data.requests : this.js;
    },
    updateRoutes: function (routes) {
      const self = this;
      routes.forEach((route) => {
        this.$router.addRoute(route);
      });
    },
    updateSelectedIndex: function (index) {
      this.selectedIndex = index;
    },
    groupAtIndexRemoved(index) {
      this.groups.default[index].members.forEach((g) => Statistics.clear(g.id));
      this.groups.default.splice(index, 1);
    },
    download: function (dataInfo) {
      let exportChunk = [];
      let numberOfFiles = 0;
      // this.chunks.loaded = 0;
      // this.$refs.LoadingModal.showModal();
      Util.stream(dataInfo.dataSource, (chunk, current, total) => {
        //this.chunks.loaded = current;
        //this.chunks.total = total;
        exportChunk = exportChunk.concat(chunk);
        if (
          this.data.memoryLimit <= Util.memorySizeOf(exportChunk) ||
          current === total
        ) {
          this.downloadFile(
            this.data.tag + "-" + dataInfo.label + "." + numberOfFiles + ".json",
            exportChunk
          );
          numberOfFiles++;
          exportChunk = [];
        }
      });
    },
    downloadFile: function (filename, payload) {
      chrome.downloads.download({
        filename: filename,
        url: URL.createObjectURL(
          new Blob([JSON.stringify(payload)], { type: "application/json" })
        ),
      });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@import "~bootstrap/dist/css/bootstrap.css";
</style>
