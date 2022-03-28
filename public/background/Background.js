import Chunk from "./Chunk.js";
import config from "../js/Settings.js";

let x = await browser.runtime.getBrowserInfo();

// TODO: seed local storage with free website lists
// TODO: seed initial settings
browser.runtime.onInstalled.addListener((d) => {
  console.log(d);
});

var Background = (() => {
  const urlFilter = { urls: ["http://*/*", "https://*/*"] };
  let http = {};
  let httpBody = config.httpBody.default;

  browser.storage.local.get("settings")
    .then((res) => {
      httpBody = (res.settings && res.settings.httpBody)
        ? res.settings.httpBody
        : httpBody;
    });

  browser.runtime
    .onMessage
    .addListener((msg) => {
      if (msg.hasOwnProperty("settings")) {
        httpBody = msg.settings.httpBody;
      }
    });

  browser.webRequest
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

  browser.webRequest
    .onBeforeSendHeaders
    .addListener((d) => {
      Background.set(d.requestId, { requestHeaders: d.requestHeaders });

      if (Background.get(d.requestId).complete &&
        Background.get(d.requestId).response) {
        Background.push(d.requestId)
      }
    },
      urlFilter,
      (x.name === "Firefox") 
        ? ["requestHeaders"]
        : ["requestHeaders"].concat(["extraHeaders"])
    );

  browser.webRequest
    .onResponseStarted
    .addListener((d) => {
      Background.set(d.requestId, { response: d });

      if (Background.get(d.requestId).complete &&
        Background.get(d.requestId).requestHeaders) {
        Background.push(d.requestId);
      }
    },
      urlFilter,
      (x.name === "Firefox") 
        ? ["responseHeaders"]
        : ["responseHeaders"].concat(["extraHeaders"])
    );

  browser.webRequest
    .onCompleted
    .addListener((d) => Background.set(d.requestId, { success: true }),
      urlFilter);

  browser.webRequest
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
        browser.tabs.get(tabId, function (tab) {
          if (browser.runtime.lastError || typeof tab === "undefined") {
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