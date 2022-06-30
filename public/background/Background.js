import "../js/browser-polyfill.min.js";
import Chunk from "./Chunk.js";
import config from "../js/Settings.js";

let firefox = false;
if (browser.runtime.hasOwnProperty("getBrowserInfo")) {
  firefox = true;
}

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
      if (!httpBody && d.hasOwnProperty("requestBody")) {
        delete d.requestBody;
      }

      http[d.requestId] = d
    },
      urlFilter,
      ["requestBody"]);

  browser.webRequest
    .onBeforeSendHeaders
    .addListener((d) => {
      http[d.requestId].requestHeaders = d.requestHeaders;
    },
      urlFilter,
      (firefox) 
        ? ["requestHeaders"]
        : ["requestHeaders"].concat(["extraHeaders"])
    );

  browser.webRequest
    .onResponseStarted
    .addListener((d) => {
      http[d.requestId].response = d
    },
      urlFilter,
      (firefox) 
        ? ["responseHeaders"]
        : ["responseHeaders"].concat(["extraHeaders"])
    );

  browser.webRequest
    .onCompleted
    .addListener((d) => {
      Background.push(d.requestId, true);
    },
      urlFilter);

  browser.webRequest
    .onErrorOccurred
    .addListener((d) => {
      Background.push(d.requestId, false);
    },
      urlFilter);

  return {
    push: (requestId, success) => {
      Chunk.add("http", 
        [ 
          Object.assign(
            { ...http[requestId] },
            { success: success }
          )
        ]
      );
      delete http[requestId];
    }
  }
})();