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
      browser.storage.local.get("settings")
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
        browser.runtime.sendMessage({ recording: true });
        
        urls = list.urls.split(/\r\n|\r|\n/g);

        log.tag = tag;
        log.startedAt = Date.now();
        log.tabsToFinish = urls.length;

        onCreatedRef = this.onCreate.bind(this);
        onUpdatedRef = this.onUpdated.bind(this);
        onRemovedRef = this.onRemoved.bind(this);
        browser.tabs.onCreated.addListener(onCreatedRef);
        browser.tabs.onUpdated.addListener(onUpdatedRef);
        browser.tabs.onRemoved.addListener(onRemovedRef);
        console.debug("Crawler: tab listeners added.")

        browser.tabs.create(this.openTab())
          .then((tab) => 
            this.closeTab(tab.id, settings.tabTtl)
          );
      });
    },
    end: function () {
      browser.runtime
        .sendMessage(
          { recording: false, flush: true }
        ).then((id) => {
          log.doneAt = id;
          this.saveLog({ ...log });
          this.emit();
          log = { ...empty };
        });

      browser.tabs.onCreated.removeListener(onCreatedRef);
      browser.tabs.onUpdated.removeListener(onUpdatedRef);
      browser.tabs.onRemoved.removeListener(onRemovedRef);
      console.debug("Crawler: tab listeners removed.")
    },
    onCreate: function () {
      log.tabsOpen += 1;
      log.tabsOpened += 1;
      if (log.tabsOpen < settings.tabsAtOnce && urls.length > 0) {
        browser.tabs.create(this.openTab())
          .then((tab) => 
            this.closeTab(tab.id, settings.tabTtl)
          );
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
        browser.tabs.create(this.openTab())
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
        browser.tabs.get(tabId)
          .then(() => {
            browser.tabs.sendMessage(
              tabId,
              { "close": true }
            ).then(() => {
              browser.tabs.remove(tabId);
            });
          }).catch(() => {
            console.debug("Tab " + tabId + " already closed.");
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
      browser.storage.local.get("crawls")
        .then((res) => {
          let crawls = (res.crawls) ? res.crawls : [];
          crawls.push(l);
          browser.storage.local.set({ crawls: crawls });
        });
    },
  };
})();

export default Crawler;