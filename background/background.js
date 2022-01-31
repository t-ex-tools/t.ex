var Background = (() => {
  const urlFilter = {urls: ["http://*/*", "https://*/*"]};
  let requests = {};
  let storeBody = false;

  let load = (() => {

    chrome.storage.local.get("settingsBodyFormData", (result) => {
      storeBody = result.settingsBodyFormData || storeBody;
    });

    chrome.runtime.onMessage.addListener((message) => {
      (message.hasOwnProperty("settingsBodyFormData")) ?
        storeBody = message.settingsBodyFormData :
        null;
    });

    chrome.webRequest
      .onBeforeRequest
        .addListener((details) => {
          if (details.tabId < 0) {
            return;
          }

          if (!storeBody && details.hasOwnProperty("requestBody")) {
            delete details.requestBody;
          }

          window.dispatchEvent(new CustomEvent("background:main:onRequest", {detail: {request: details}}));
          Background.setRequest(details.requestId, details);

          Background.getCompletedTabFromId(details.tabId, (tab) => {
            Background.setRequest(details.requestId, {source: tab.url, complete: true});

            (Background.getRequest(details.requestId).requestHeaders &&
            Background.getRequest(details.requestId).response) ?
              Background.pushToQueue(details.requestId):
              null;
          });
        },
        urlFilter,
        ["requestBody"]);    

    chrome.webRequest
      .onBeforeSendHeaders
        .addListener((details) => {
          Background.setRequest(details.requestId, {requestHeaders: details.requestHeaders}),

          (Background.getRequest(details.requestId).complete &&
            Background.getRequest(details.requestId).response) ?
              Background.pushToQueue(details.requestId):
              null;
        },
        urlFilter, 
        ["requestHeaders", "extraHeaders"]);

    chrome.webRequest
      .onResponseStarted
        .addListener((details) => {
          Background.setRequest(details.requestId, {response: details});

          (Background.getRequest(details.requestId).complete &&
            Background.getRequest(details.requestId).requestHeaders) ?
              Background.pushToQueue(details.requestId):
              null;
        },
        urlFilter,
        ["responseHeaders", "extraHeaders"]);

    chrome.webRequest
      .onCompleted
        .addListener((details) => Background.setRequest(details.requestId, {success: true}),
        urlFilter);

    chrome.webRequest
      .onErrorOccurred
        .addListener((details) => Background.setRequest(details.requestId, {success: false}),
        urlFilter);

    window.dispatchEvent(new CustomEvent("background:main:loaded", {detail: {}}));
    return () => true;
  })();

  return {
    isLoaded: () => load(),

    getRequest: (requestId) => requests[requestId],

    setRequest: (requestId, obj) => {
      let tmp = (requests[requestId]) ? requests[requestId] : {};
      requests[requestId] = Object.assign(tmp, obj);
    },

    pushToQueue: (requestId) => {
      Requests.add(Background.getRequest(requestId));
      delete Background.getRequest(requestId);
    },

    getCompletedTabFromId: (tabId, callback) => {
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