import Chunk from "./Chunk.js";

// TODO: seed local storage with free website lists
chrome.runtime.onInstalled.addListener((details) => {
  console.log(details);
});

var Background = (() => {
  const urlFilter = { urls: ["http://*/*", "https://*/*"] };
  let http = {};
  let httpBody = false;

  let load = (() => {

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
      .addListener((details) => {
        if (details.tabId < 0) {
          return;
        }

        if (!httpBody && details.hasOwnProperty("requestBody")) {
          delete details.requestBody;
        }

        Background.set(details.requestId, details);
        Background.tab(details.tabId, (tab) => {
          Background.set(details.requestId, { source: tab.url, complete: true });

          if (Background.get(details.requestId).requestHeaders &&
              Background.get(details.requestId).response) {
              Background.push(details.requestId);
          }
        });
      },
        urlFilter,
        ["requestBody"]);

    chrome.webRequest
      .onBeforeSendHeaders
      .addListener((details) => {
        Background.set(details.requestId, { requestHeaders: details.requestHeaders });

        if (Background.get(details.requestId).complete && 
            Background.get(details.requestId).response) {
            Background.push(details.requestId)
        }
      },
        urlFilter,
        ["requestHeaders", "extraHeaders"]);

    chrome.webRequest
      .onResponseStarted
      .addListener((details) => {
        Background.set(details.requestId, { response: details });

        if (Background.get(details.requestId).complete &&
            Background.get(details.requestId).requestHeaders) {
            Background.push(details.requestId);
        }
      },
        urlFilter,
        ["responseHeaders", "extraHeaders"]);

    chrome.webRequest
      .onCompleted
      .addListener((details) => Background.set(details.requestId, { success: true }),
        urlFilter);

    chrome.webRequest
      .onErrorOccurred
      .addListener((details) => Background.set(details.requestId, { success: false }),
        urlFilter);

    return () => true;
  })();

  return {
    isLoaded: () => load(),

    get: (requestId) => http[requestId],

    set: (requestId, obj) => {
      let tmp = (http[requestId]) ? http[requestId] : {};
      http[requestId] = Object.assign(tmp, obj);
    },

    push: (requestId) => {
      Chunk.add("http", [ Background.get(requestId) ]);
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
    },
  }
})();