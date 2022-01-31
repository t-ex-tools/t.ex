import Crypt from "./model/Crypt.js";
import Statistics from "./model/Statistics.js";
import Util from "./model/Util.js";

import InitModal from "./components/modals/InitModal.js";
import LoadingModal from "./components/modals/LoadingModal.js";
import SettingsModal from "./components/modals/SettingsModal.js";

import RequestsTable from "./components/content/RequestsTable.js";
import Graph from "./components/content/Graph.js";

import Base from "./components/Base.js";
import Sidebar from "./components/Sidebar.js";
import Navigation from "./components/Navigation.js";
import TabBar from "./components/TabBar.js";

import defaultGroups from "./resources/DefaultGroups.js";

window.location.hash = "/";

var vm = new Vue({
  el: "#app",
  router: new VueRouter({routes: []}),
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
  data: {
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
  },
  created() {
    google.charts.load("49", {"packages": ["corechart", "controls"]});

    chrome.storage.local.get([
      "settingsEncryption", 
      "settingsChunksAtOnce"
    ], (setting) => {
      let useEncryption = setting.settingsEncryption || false;
      vm.windowSize = Number.parseInt(setting.settingsChunksAtOnce) || vm.windowSize;
      vm.$refs.InitModal.showModal(useEncryption, true, () => vm.bootstrap(useEncryption));
    });
  },
  methods: {
    bootstrap: function(useEncryption) {
      chrome.storage.local.get("indexes", (result) => {
        vm.getChunks(result.indexes || [], useEncryption); 
        vm.$refs.LoadingModal.showModal();
        Statistics.initialize(vm.passData);
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
                Crypt.decryptChunk(chunk) : 
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
      this.$router.addRoutes(routes);
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
      this.$refs.LoadingModal.showModal();
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
      vm.$refs.SettingsModal.showModal()
    },
    createPassword: function() {
      vm.$refs.InitModal.showModal(true, false, () => {});
    },
  }
});