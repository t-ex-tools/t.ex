import config from "../model/Settings.js";

const empty = {
  tag: "",
  startedAt: 0,
  doneAt: 0,
  tabsOpen: 0,
  tabsOpened: 0,
  tabsCompleted: 0,
  tabsToFinish: 0,
};

var Crawler = (() => {
  let urls = [];
  let log = { ...empty };
  let settings = {
    tabsAtOnce: config.tabsAtOnce.default,
    tabTtl: config.tabTtl.default,
    waitAfterComplete: config.waitAfterComplete.default
  }

  let onCreatedRef;
  let onUpdatedRef;
  let onRemovedRef;

  return {
    getSettings: (callback) => {
      chrome.storage.local.get("settings")
        .then((res) => {
          if (res.settings) {
            Object
              .keys(settings)
              .forEach((k) => 
                settings[k] = (res.settings.hasOwnProperty(k)) 
                ? res.settings[k] 
                : settings[k]
              );
          }
          callback();
        });
    },
    start: function (tag, list) {
      this.getSettings(() => {
        chrome.runtime.sendMessage({ recording: true });
        
        urls = list.urls.split(/\r\n|\r|\n/g);

        log.tag = tag;
        log.startedAt = Date.now();
        log.tabsToFinish = urls.length;

        onCreatedRef = this.onCreate.bind(this);
        onUpdatedRef = this.onUpdated.bind(this);
        onRemovedRef = this.onRemoved.bind(this);
        chrome.tabs.onCreated.addListener(onCreatedRef);
        chrome.tabs.onUpdated.addListener(onUpdatedRef);
        chrome.tabs.onRemoved.addListener(onRemovedRef);
        console.debug("Crawler: tab listeners added.")

        chrome.tabs.create(this.openTab(), (tab) => this.closeTab(tab.id, settings.tabTtl));
      });
    },
    end: function () {
      // TODO: to be fixed in Chrome 99 sendMessage() to return Promise
      chrome.runtime
        .sendMessage(
          { recording: false, flush: true },
          (id) => {
            log.doneAt = id;
            this.saveLog({ ...log });
            this.emit();
            log = { ...empty };
          }
        );

      chrome.tabs.onCreated.removeListener(onCreatedRef);
      chrome.tabs.onUpdated.removeListener(onUpdatedRef);
      chrome.tabs.onRemoved.removeListener(onRemovedRef);
      console.debug("Crawler: tab listeners removed.")
    },
    onCreate: function () {
      log.tabsOpen += 1;
      log.tabsOpened += 1;
      if (log.tabsOpen < settings.tabsAtOnce && urls.length > 0) {
        chrome.tabs.create(this.openTab(), (tab) => this.closeTab(tab.id, settings.tabTtl));
      }
    },
    onUpdated: function (tabId, changeInfo) {
      if (changeInfo.status === "complete") {
        this.closeTab(tabId, settings.waitAfterComplete);
      }
    },
    onRemoved: function () {
      this.emit();
      log.tabsOpen -= 1;
      log.tabsCompleted++;
      if (log.tabsOpen < settings.tabsAtOnce && urls.length > 0) {
        chrome.tabs.create(this.openTab())
      }
    },
    openTab: function () {
      let url = this.url(urls.shift());
      if (urls.length === 0) {
        setTimeout(this.end.bind(this), settings.tabTtl * 1000)
      }
      return {
        active: false,
        url: url
      };
    },
    closeTab: (tabId, delay) => {
      setTimeout(() => {
        chrome.tabs.get(tabId, () => {
          if (!chrome.runtime.lastError) { 
            chrome.tabs.remove(tabId);
          }
        });
      }, delay * 1000);
    },
    url: function (domain) {
      return (domain.startsWith("https://")) ? domain : "https://" + domain;
    },
    emit: function () {
      window.dispatchEvent(new CustomEvent("crawler:log", { detail: { log: { ...log } } }));
    },
    saveLog: function (l) {
      chrome.storage.local.get("crawls")
        .then((res) => {
          let crawls = (res.crawls) ? res.crawls : [];
          crawls.push(l);
          chrome.storage.local.set({ crawls: crawls });
        });
    },
  };
})();

export default Crawler;