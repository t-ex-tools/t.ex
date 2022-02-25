import Chunk from "./Chunk.js";

// TODO: seed local storage with free website lists
// TODO: seed initial settings
chrome.runtime.onInstalled.addListener((d) => {
  console.log(d);
});

var Background = (() => {
  const urlFilter = { urls: ["http://*/*", "https://*/*"] };
  let http = {};
  let httpBody = false;

  chrome.storage.local.get("settings")
    .then((res) => {
      httpBody = (res.settings && res.settings.httpBody)
        ? res.settings.httpBody
        : httpBody;
    });

  chrome.runtime
    .onMessage
    .addListener((msg) => {
      if (msg.hasOwnProperty("httpBody")) {
        httpBody = msg.httpBody;
      }
    });

  chrome.webRequest
    .onBeforeRequest
    .addListener((d) => {
      if (d.tabId < 0) {
        return;
      }

      if (!httpBody && d.hasOwnProperty("requestBody")) {
        delete d.requestBody;
      }

      Background.set(d.requestId, d);
      Background.tab(d.tabId, (tab) => {
        Background.set(d.requestId, { source: tab.url, complete: true });

        if (Background.get(d.requestId).requestHeaders &&
          Background.get(d.requestId).response) {
          Background.push(d.requestId);
        }
      });
    },
      urlFilter,
      ["requestBody"]);

  chrome.webRequest
    .onBeforeSendHeaders
    .addListener((d) => {
      Background.set(d.requestId, { requestHeaders: d.requestHeaders });

      if (Background.get(d.requestId).complete &&
        Background.get(d.requestId).response) {
        Background.push(d.requestId)
      }
    },
      urlFilter,
      ["requestHeaders", "extraHeaders"]);

  chrome.webRequest
    .onResponseStarted
    .addListener((d) => {
      Background.set(d.requestId, { response: d });

      if (Background.get(d.requestId).complete &&
        Background.get(d.requestId).requestHeaders) {
        Background.push(d.requestId);
      }
    },
      urlFilter,
      ["responseHeaders", "extraHeaders"]);

  chrome.webRequest
    .onCompleted
    .addListener((d) => Background.set(d.requestId, { success: true }),
      urlFilter);

  chrome.webRequest
    .onErrorOccurred
    .addListener((d) => Background.set(d.requestId, { success: false }),
      urlFilter);

  return {
    get: (requestId) => http[requestId],

    set: (requestId, obj) => {
      let tmp = (http[requestId]) ? http[requestId] : {};
      http[requestId] = Object.assign(tmp, obj);
    },

    push: (requestId) => {
      Chunk.add("http", [Background.get(requestId)]);
      delete Background.get(requestId);
    },

    tab: (tabId, callback) => {
      try {
        chrome.tabs.get(tabId, function (tab) {
          if (chrome.runtime.lastError || typeof tab === "undefined") {
            return;
          } else {
            callback(tab);
          }
        });
      } catch (err) {
        if (err) {
          callback(null);
        }
      }
    }
  }
})();