import "../js/browser-polyfill.min.js";
import Chunk from "./Chunk.js";
import config from "../js/Settings.js";

let firefox = false;
// TODO: temporary check until better strategy identified
if (browser.runtime.hasOwnProperty("getBrowserInfo")) {
  firefox = true;
}

console.log(browser.runtime);

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
    },
      urlFilter,
      ["requestBody"]);

  browser.webRequest
    .onBeforeSendHeaders
    .addListener((d) => {
      Background.set(d.requestId, { requestHeaders: d.requestHeaders });
    },
      urlFilter,
      (firefox) 
        ? ["requestHeaders"]
        : ["requestHeaders"].concat(["extraHeaders"])
    );

  browser.webRequest
    .onResponseStarted
    .addListener((d) => {
      Background.set(d.requestId, { response: d });
    },
      urlFilter,
      (firefox) 
        ? ["responseHeaders"]
        : ["responseHeaders"].concat(["extraHeaders"])
    );

  browser.webRequest
    .onCompleted
    .addListener((d) => {
      Background.set(d.requestId, { success: true });
      Background.push(d.requestId);
    },
      urlFilter);

  browser.webRequest
    .onErrorOccurred
    .addListener((d) => {
      Background.set(d.requestId, { success: false });
      Background.push(d.requestId);
    },
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
    }
  }
})();