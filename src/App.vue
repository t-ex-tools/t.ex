<template>
  <div>

    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Navbar</a>
      </div>
      <div class="d-flex">
        <button variant="primary" title="Settings" class="p-1" @click="openSettings()">
          <i class="bi bi-gear"></i>
        </button>        
      </div>
    </nav>
    
    <tab-bar
      :groups="groups"
      :selected-index="selectedIndex"
      @tabs-changed="updateSelectedIndex"
      @tab-removed="groupAtIndexRemoved">
    </tab-bar>

    <b-container fluid class="h-100">
      <b-row class="h-100">

        <b-col cols="2" class="border-right pt-3">
          <navigation
            :groups="groups"
            :selected-index="selectedIndex"
            :data-tag="dataTag"
            @routes-changed="updateRoutes">
          </navigation>
        </b-col>

        <b-col cols="8" class="pt-3">
          <router-view
            :requests="requests" 
            :js="js"
            :data-tag="dataTag">
          </router-view>
        </b-col>

        <b-col cols="2" class="border-left pt-3">
          <sidebar
            :requests="requests" 
            :js="js"
            v-on:trigger-download="download">
          </sidebar>
        </b-col>
        
      </b-row>
    </b-container>

    <loading-modal 
      ref="LoadingModal" 
      :loaded="alreadyLoaded + windowSize" 
      :total="numberOfChunks">
    </loading-modal>
    
    <init-modal 
      ref="InitModal" 
      @update-limit="updateLimit">
    </init-modal>
    
    <settings-modal 
      ref="SettingsModal" 
      @create-password="createPassword">
    </settings-modal>
    
  </div>
</template>

<script>
import Util from "./model/Util.js";
import Statistics from "./model/Statistics.js";
import Crypt from "./model/Crypt.js";

import InitModal from "./components/modals/InitModal.js";
import LoadingModal from "./components/modals/LoadingModal.js";
import SettingsModal from "./components/modals/SettingsModal.js";

import RequestsTable from "./components/content/RequestsTable.js";
import Graph from "./components/content/Graph.js";

import Base from "./components/Base.js";
import Sidebar from "./components/Sidebar.js";
import Navigation from "./components/Navigation.js";
import TabBar from "./components/TabBar.js";

import defaultGroups from "./model/DefaultGroups.js";

window.location.hash = "/";

export default {
  name: 'App',
  // router: new VueRouter({routes: []}),
  components: {
    "InitModal": InitModal,
    "LoadingModal": LoadingModal,
    "SettingsModal": SettingsModal,
    "RequestsTable": RequestsTable,
    "Base": Base,
    "Graph": Graph,
    "Sidebar": Sidebar,
    "Navigation": Navigation,
    "TabBar": TabBar,
  },
  data: () => {
    return {
      windowSize: 6,
      alreadyLoaded: 0,
      numberOfChunks: -1,
      requests: [],
      js: [],
      // groups: defaultGroups,
      selectedIndex: 0,
      boundaries: {
        lower: 0,
        upper: 0,
      },
      dataTag: Util.randomString(),
      memoryLimit: 256 * 1000000,
    }
  },
  created() {
    const self = this;
    // google.charts.load("49", {"packages": ["corechart", "controls"]});

    chrome.storage.local.get([
      "settingsEncryption", 
      "settingsChunksAtOnce"
    ], (setting) => {
      let useEncryption = setting.settingsEncryption || false;
      self.windowSize = Number.parseInt(setting.settingsChunksAtOnce) || self.windowSize;
      // self.$refs.InitModal.showModal(useEncryption, true, () => self.bootstrap(useEncryption));
    });
  },
  methods: {
    bootstrap: function(useEncryption) {
      const self = this;
      chrome.storage.local.get("indexes", (result) => {
        this.getChunks(result.indexes || [], useEncryption); 
        // this.$refs.LoadingModal.showModal();
        Statistics.initialize(this.passData);
      });
    },
    getChunks: function(indexes, useEncryption) {
      let keys = indexes
        .filter((e) => this.boundaries.lower <= e && e <= this.boundaries.upper)
        .map((e) => e.toString());

      this.numberOfChunks = keys.length;
      for (let i=0; i * this.windowSize < keys.length; i++) {
        chrome.storage.local.get(keys.slice(i * this.windowSize, i * this.windowSize + this.windowSize), (chunks) => {
          Object.values(chunks).forEach((chunk, index) => {
            let tmp = (useEncryption) ? 
              (chunk.hasOwnProperty("aesKey")) ? 
                /*Crypt.decryptChunk(chunk)*/ chunk : 
                chunk :
              (chunk.hasOwnProperty("aesKey")) ?
                {requests: null, js: null} :
                chunk;
            this.requests.push(tmp.requests);
            this.js.push(tmp.js);
            this.alreadyLoaded = i * this.windowSize + (index+1);
          });
        });
      }
    },
    passData: function(source) {
      return (source === "requests") ? 
          this.requests
          : this.js;
    },
    updateRoutes: function(routes) {
      // this.$router.addRoutes(routes);
    },
    updateSelectedIndex: function(index) {
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
        if (this.memoryLimit <= Util.memorySizeOf(exportChunk) ||
            current === total) {
              this.downloadFile(this.dataTag + "-" + dataInfo.label + "." + numberOfFiles + ".json", exportChunk);
              numberOfFiles++;
              exportChunk = [];
            }
      });
    },
    downloadFile: function(filename, payload) {
      chrome.downloads.download({
        filename: filename,
        url: URL.createObjectURL(new Blob([JSON.stringify(payload)], {type: "application/json"}))
      });
    },
    updateLimit: function(boundaries) {
      this.dataTag = boundaries.dataTag;
      delete boundaries.dataTag;
      this.boundaries = boundaries;
    },
    openSettings: function() {
      // this.$refs.SettingsModal.showModal()
    },
    createPassword: function() {
      // this.$refs.InitModal.showModal(true, false, () => {});
    },
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@import'~bootstrap/dist/css/bootstrap.css'
</style>
