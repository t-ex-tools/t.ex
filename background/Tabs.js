var Tabs = (() => {
  let tabs = {};

  let load = (() => {
    chrome.tabs.query({}, (tabs) => tabs.forEach((e) => Tabs.add(e)))
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => Tabs.add(tab));

    window.dispatchEvent(new CustomEvent("background:tabs:loaded", {detail: {}}));
    return () => true;
  })();

  return {
    isLoaded: () => load(),
    add: (tab) => tabs[tab.id] = tab,
  }    
})();

