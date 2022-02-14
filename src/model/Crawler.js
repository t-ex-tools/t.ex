var Crawler = (() => {
  let crawl = [];
  let runningCrawl = {
    tag: "",
    startedAt: 0,
    doneAt: 0,
    tabsOpen: 0,
    tabsOpened: 0,
    tabsCompleted: 0,
    tabsToFinish: 0,
  };
  let tabsAtOnce = 20;
  let tabTtl = 30;
  const waitAfterComplete = 5;

  let load = (() => {
  })();

  let onCreatedRef;
  let onUpdatedRef;
  let onRemovedRef;

  return {
    getSettings: (callback) => {
      chrome.storage.local.get(["settingsTabsAtOnce", "settingsTabTtl"], (result) => {
        (result.hasOwnProperty("settingsTabsAtOnce")) ?
          tabsAtOnce = Number.parseInt(result.settingsTabsAtOnce) :
          null;
  
        (result.hasOwnProperty("settingsTabTtl")) ?
          tabTtl = Number.parseInt(result.settingsTabTtl) :        
          null;

        callback();
      });
    },
    startCrawl: function(pCrawl) {
      this.getSettings(() => {
        crawl = [...pCrawl.urls];
        runningCrawl.tag = pCrawl.tag;
        runningCrawl.startedAt = Date.now();
        runningCrawl.tabsToFinish = crawl.length;
        onCreatedRef = this.onCreate.bind(this);
        onUpdatedRef = this.onUpdated.bind(this);
        onRemovedRef = this.onRemoved.bind(this);
        chrome.tabs.onCreated.addListener(onCreatedRef);
        chrome.tabs.onUpdated.addListener(onUpdatedRef);
        chrome.tabs.onRemoved.addListener(onRemovedRef);
        chrome.tabs.create(this.openTab(), (tab) => this.closeTab(tab.id, tabTtl));
      });
    },
    endCrawl: function() {
      runningCrawl.doneAt = Date.now();
      chrome.runtime.sendMessage({flush: true});
      this.saveCrawlStats({...runningCrawl});
      this.emitStatus();
      chrome.tabs.onCreated.removeListener(onCreatedRef);
      chrome.tabs.onUpdated.removeListener(onUpdatedRef);
      chrome.tabs.onRemoved.removeListener(onRemovedRef);
      runningCrawl = {
        tabsOpen: 0,
        tabsOpened: 0,
        tabsCompleted: 0,
        tabsToFinish: 0,
      };
    },
    onCreate: function() {
      runningCrawl.tabsOpen += 1;
      runningCrawl.tabsOpened += 1;
      (runningCrawl.tabsOpen < tabsAtOnce && crawl.length > 0) ?
        chrome.tabs.create(this.openTab(), (tab) => this.closeTab(tab.id, tabTtl)) :
        null;
    },
    onUpdated: function(tabId, changeInfo) {
      (changeInfo.status === "complete") ?
        this.closeTab(tabId, waitAfterComplete) :
        null;
    },
    onRemoved: function() {
      this.emitStatus();
      runningCrawl.tabsOpen -= 1;
      runningCrawl.tabsCompleted++, 
      (runningCrawl.tabsOpen < tabsAtOnce && crawl.length > 0) ?
        chrome.tabs.create(this.openTab()) 
        : null;
    },
    openTab: function() {
      let url = this.url(crawl.shift());
      (crawl.length === 0) ?
        setTimeout(this.endCrawl.bind(this), (tabTtl + waitAfterComplete * 12) * 1000)
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
    url: function(domain) {
      return (domain.startsWith("https://")) ? domain : "https://" + domain;
    },
    emitStatus: function() {
      window.dispatchEvent(new CustomEvent("crawler:crawlStatus", {detail: {crawlStatus: {...runningCrawl}}}));
    },
    saveCrawlStats: function(crawlStats) {
      chrome.storage.local.get(crawlStats.tag, (result) => {
        let obj = {};
        obj[crawlStats.tag] = [crawlStats].concat(result[crawlStats.tag] || []);
        chrome.storage.local.set(obj, null);
      });
    },
  };
})();

export default Crawler;