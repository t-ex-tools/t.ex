<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">T.EX</a>
        <div class="d-flex">
          <button
            class="btn btn-primary p-1"
            type="button"
            data-bs-toggle="modal" 
            data-bs-target="#settings-modal"
          >
            <i class="bi bi-gear me-2"></i>
            <small>Settings</small>
          </button>
        </div>
      </div>
    </nav>

    <tab-bar
      :groups="groups"
      :selected-index="selectedIndex"
      @tabs-changed="updateSelectedIndex"
      @tab-removed="groupAtIndexRemoved"
    >
    </tab-bar>

    <div class="container-fluid h-100">
      <div class="row h-100">
        <div class="col-2 border-right pt-3">
          <navigation
            :groups="groups"
            :selected-index="selectedIndex"
            :data-tag="dataTag"
            @routes-changed="updateRoutes"
          >
          </navigation>
        </div>

        <div class="col-8 pt-3">
          <router-view :requests="requests" :js="js" :data-tag="dataTag">
          </router-view>
        </div>

        <div class="col-2 border-left pt-3">
          <sidebar
            :requests="requests"
            :js="js"
            v-on:trigger-download="download"
          >
          </sidebar>
        </div>
      </div>
    </div>

    <loading-modal
      ref="LoadingModal"
      :loaded="alreadyLoaded + windowSize"
      :total="numberOfChunks"
    >
    </loading-modal>

    <init-modal ref="InitModal" @update-limit="updateLimit"> </init-modal>

    <settings-modal ref="SettingsModal" @create-password="createPassword">
    </settings-modal>
  </div>
</template>

<script>
import Util from "./model/Util.js";
import Statistics from "./model/Statistics.js";
import Crypt from "./model/Crypt.js";

import InitModal from "./components/modals/InitModal.vue";
import LoadingModal from "./components/modals/LoadingModal.vue";
import SettingsModal from "./components/modals/SettingsModal.vue";

import Sidebar from "./components/Sidebar.vue";
import Navigation from "./components/Navigation.vue";
import TabBar from "./components/TabBar.vue";

import defaultGroups from "./model/DefaultGroups.js";

export default {
  name: "App",
  components: {
    InitModal: InitModal,
    LoadingModal: LoadingModal,
    SettingsModal: SettingsModal,
    Sidebar: Sidebar,
    Navigation: Navigation,
    TabBar: TabBar,
  },
  data: () => {
    return {
      windowSize: 6,
      alreadyLoaded: 0,
      numberOfChunks: -1,
      requests: [],
      js: [],
      groups: defaultGroups,
      selectedIndex: 0,
      boundaries: {
        lower: 0,
        upper: 0,
      },
      dataTag: Util.randomString(),
      memoryLimit: 256 * 1000000,
    };
  },
  created() {
    const self = this;
    // google.charts.load("49", {"packages": ["corechart", "controls"]});

    chrome.storage.local.get(
      ["settingsEncryption", "settingsChunksAtOnce"],
      (setting) => {
        let useEncryption = setting.settingsEncryption || false;
        self.windowSize =
          Number.parseInt(setting.settingsChunksAtOnce) || self.windowSize;
        // self.$refs.InitModal.showModal(useEncryption, true, () => self.bootstrap(useEncryption));
      }
    );
  },
  methods: {
    bootstrap: function (useEncryption) {
      const self = this;
      chrome.storage.local.get("indexes", (result) => {
        this.getChunks(result.indexes || [], useEncryption);
        // this.$refs.LoadingModal.showModal();
        Statistics.initialize(this.passData);
      });
    },
    getChunks: function (indexes, useEncryption) {
      let keys = indexes
        .filter((e) => this.boundaries.lower <= e && e <= this.boundaries.upper)
        .map((e) => e.toString());

      this.numberOfChunks = keys.length;
      for (let i = 0; i * this.windowSize < keys.length; i++) {
        chrome.storage.local.get(
          keys.slice(
            i * this.windowSize,
            i * this.windowSize + this.windowSize
          ),
          (chunks) => {
            Object.values(chunks).forEach((chunk, index) => {
              let tmp = useEncryption
                ? chunk.hasOwnProperty("aesKey")
                  ? /*Crypt.decryptChunk(chunk)*/ chunk
                  : chunk
                : chunk.hasOwnProperty("aesKey")
                ? { requests: null, js: null }
                : chunk;
              this.requests.push(tmp.requests);
              this.js.push(tmp.js);
              this.alreadyLoaded = i * this.windowSize + (index + 1);
            });
          }
        );
      }
    },
    passData: function (source) {
      return source === "requests" ? this.requests : this.js;
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
      this.groups[index].members.forEach((g) => Statistics.clear(g.id));
      this.groups.splice(index, 1);
    },
    download: function (dataInfo) {
      let exportChunk = [];
      let numberOfFiles = 0;
      this.alreadyLoaded = 0;
      // this.$refs.LoadingModal.showModal();
      Util.stream(dataInfo.dataSource, (chunk, current, total) => {
        this.alreadyLoaded = current;
        this.numberOfChunks = total;
        exportChunk = exportChunk.concat(chunk);
        if (
          this.memoryLimit <= Util.memorySizeOf(exportChunk) ||
          current === total
        ) {
          this.downloadFile(
            this.dataTag + "-" + dataInfo.label + "." + numberOfFiles + ".json",
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
    updateLimit: function (boundaries) {
      this.dataTag = boundaries.dataTag;
      delete boundaries.dataTag;
      this.boundaries = boundaries;
    },
    openSettings: function () {
      // this.$refs.SettingsModal.showModal()
    },
    createPassword: function () {
      // this.$refs.InitModal.showModal(true, false, () => {});
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
