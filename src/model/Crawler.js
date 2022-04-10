import config from "../model/Settings.js";

const empty = {
  tag: "",
  startedAt: 0,
  doneAt: 0,
  tabsOpen: 0,
  tabsOpened: 0,
  tabsCompleted: 0,
  tabsToFinish: 0,
  tabsNotResponding: 0
};

var Crawler = (() => {
  let urls = [];
  let log = { ...empty };
  let settings = {
    tabsAtOnce: config.tabsAtOnce.default,
    tabTtl: config.tabTtl.default
  }

  let onCreatedRef;
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
        onRemovedRef = this.onRemoved.bind(this);
        browser.tabs.onCreated.addListener(onCreatedRef);
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
    onRemoved: function () {
      this.emit();
      log.tabsOpen -= 1;
      log.tabsCompleted++;
      if (log.tabsOpen < settings.tabsAtOnce && urls.length > 0) {
        browser.tabs.create(this.openTab())
          .then((tab) => 
            this.closeTab(tab.id, settings.tabTtl)
          );
      }
    },
    openTab: function () {
      let url = this.url(urls.shift());
      if (urls.length === 0) {
        setTimeout(this.end.bind(this), ((settings.tabTtl * 2) * 1000))
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
            ).catch(() => {
              console.debug("Tab " + tabId + " was not responsive.");
              log.tabsNotResponding += 1;
            }).finally(() => {
              browser.tabs
                .remove(tabId)
                .catch(() => {
                  console.debug("Tab " + tabId + " already closed.");
                });
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