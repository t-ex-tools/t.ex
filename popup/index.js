import Vue from "../app/libraries/vue.js/vue.js"

var vm = new Vue({
  el: "#app",
  components: {
  },
  data: {
  },
  mounted() {
  },
  methods: {
    openApp: () => chrome.tabs.create({url: chrome.extension.getURL("app/index.html")}),
    flushRequests: function() {
      chrome.runtime.sendMessage({flush: true});
    },
  }
});