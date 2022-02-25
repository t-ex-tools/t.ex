import Vue from "../libraries/vue.js/vue.js"

var vm = new Vue({
  el: "#app",
  components: {
  },
  data: function() {
return {
  };
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