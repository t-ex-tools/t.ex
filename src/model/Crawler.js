import config from "../assets/settings.json";

var Crawler = (() => {
  let urls = [];
  let log = {
    tag: "",
    startedAt: 0,
    doneAt: 0,
    tabsOpen: 0,
    tabsOpened: 0,
    tabsCompleted: 0,
    tabsToFinish: 0,
  };
  let settings = {
    tabsAtOnce: config.find((s) => s.key === "tabsAtOnce").default,
    tabTtl: config.find((s) => s.key === "tabTtl").default,
    waitAfterComplete: config.find((s) => s.key === "waitAfterComplete").default
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
              .forEach((k) => settings[k] = (res.settings[k]) ? res.settings[k] : settings[k]);
          }
          callback();
        });
    },
    start: function (crawl) {
      this.getSettings(() => {
        urls = [...crawl.urls];

        log.tag = crawl.tag;
        log.startedAt = Date.now();
        log.tabsToFinish = urls.length;

        onCreatedRef = this.onCreate.bind(this);
        onUpdatedRef = this.onUpdated.bind(this);
        onRemovedRef = this.onRemoved.bind(this);
        chrome.tabs.onCreated.addListener(onCreatedRef);
        chrome.tabs.onUpdated.addListener(onUpdatedRef);
        chrome.tabs.onRemoved.addListener(onRemovedRef);

        chrome.tabs.create(this.openTab(), (tab) => this.closeTab(tab.id, settings.tabTtl));
      });
    },
    end: function () {
      chrome.runtime.sendMessage({ flush: true });

      log.doneAt = Date.now();
      this.saveLog({ ...log });
      this.emit();

      chrome.tabs.onCreated.removeListener(onCreatedRef);
      chrome.tabs.onUpdated.removeListener(onUpdatedRef);
      chrome.tabs.onRemoved.removeListener(onRemovedRef);

      log = {
        tabsOpen: 0,
        tabsOpened: 0,
        tabsCompleted: 0,
        tabsToFinish: 0,
      };
    },
    onCreate: function () {
      log.tabsOpen += 1;
      log.tabsOpened += 1;
      (log.tabsOpen < settings.tabsAtOnce && urls.length > 0) ?
        chrome.tabs.create(this.openTab(), (tab) => this.closeTab(tab.id, settings.tabTtl)) :
        null;
    },
    onUpdated: function (tabId, changeInfo) {
      (changeInfo.status === "complete") ?
        this.closeTab(tabId, settings.waitAfterComplete) :
        null;
    },
    onRemoved: function () {
      this.emit();
      log.tabsOpen -= 1;
      log.tabsCompleted++,
        (log.tabsOpen < settings.tabsAtOnce && urls.length > 0) ?
          chrome.tabs.create(this.openTab())
          : null;
    },
    openTab: function () {
      let url = this.url(urls.shift());
      (urls.length === 0) ?
        setTimeout(this.end.bind(this), (settings.tabTtl + settings.waitAfterComplete * 12) * 1000)
        : null;
      return {
        active: false,
        url: url
      };
    },
    closeTab: (tabId, delay) => {
      setTimeout(() => {
        chrome.tabs.get(tabId, () => {
          (chrome.runtime.lastError) ? null : chrome.tabs.remove(tabId);
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