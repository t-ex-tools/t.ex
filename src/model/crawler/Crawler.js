import Crawl from "../classes/Crawl.js";
import Setting from "../classes/Setting.js";

var Crawler = (() => {
  let urls = [];
  let log = Crawl.log();
  let settings = {};

  let onCreatedRef;
  let onRemovedRef;

  return {
    getSettings: (callback) => {
      Setting.get(
        ["tabsAtOnce", "tabTtl"],
        (cfg) => {
          settings = cfg;
          callback();
        }
      );
    },
    start: function (tag, list) {
      this.getSettings(() => {
        browser.runtime.sendMessage({ recording: true });
        
        urls = list.urls.split(/\r\n|\r|\n/g);

        log.tag = tag;
        log.list = list.name;
        log.startedAt = Date.now();
        log.tabsToFinish = urls.length;

        onCreatedRef = this.onCreate.bind(this);
        onRemovedRef = this.onRemoved.bind(this);
        browser.tabs.onCreated.addListener(onCreatedRef);
        browser.tabs.onRemoved.addListener(onRemovedRef);
        console.debug("Crawler: tab listeners added.")

        for (let i=0; i < settings.tabsAtOnce; i++) {
          if (urls.length > 0) {
            browser.tabs.create(this.openTab())
              .then((tab) => 
                this.closeTab(tab.id, settings.tabTtl)
              );
          }
        }
      });
    },
    end: function () {
      browser.runtime
        .sendMessage(
          { recording: false, flush: true }
        ).then((id) => {
          log.doneAt = id;
          Crawl.add(
            { ...log }, 
            () => {
              this.emit();
              log = Crawl.log();
            }
          );
        });

      browser.tabs.onCreated.removeListener(onCreatedRef);
      browser.tabs.onRemoved.removeListener(onRemovedRef);
      console.debug("Crawler: tab listeners removed.")
    },
    onCreate: function () {
      log.tabsOpen += 1;
      log.tabsOpened += 1;
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
  };
})();

export default Crawler;