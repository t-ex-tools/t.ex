import "../libraries/lz-string/lz-string.min.js";

export default (() => {
  let requestsQueue = [];
  let jsQueue = [];
  let chunkSize = 1500;

  let load = (() => {
    chrome.storage.local.get(["settingsChunkSize"], (result) => {
      (result.hasOwnProperty("settingsChunkSize")) ?
        (chunkSize = Number.parseInt(result.settingsChunkSize)) :
        null;
    });

    chrome.runtime.onMessage.addListener((message) => {

      (message.hasOwnProperty("delete")) ?
        Requests.setPubKey(null) :

        (message.hasOwnProperty("flush")) ?
          (pushRequests(requestsQueue, jsQueue),
            requestsQueue = [],
            jsQueue = []) :

          (message.hasOwnProperty("js")) ?
            Requests.addEvent(message.js) :

            (message.hasOwnProperty("settingsChunkSize")) ?
              chunkSize = Number.parseInt(message.settingsChunkSize) :

              null;
    });

    return () => true;
  })();

  let scheduleWorker = (delay) => setTimeout(updateRequests, delay);

  let updateRequests = () => {
    let requestsToUpdate = requestsQueue.filter((e) => e.complete);
    let jsToUpdate = jsQueue;

    if (requestsToUpdate.length < chunkSize) {
      return;
    }

    jsQueue = [];
    requestsQueue = requestsQueue.filter((e) => !e.complete);
    pushRequests(requestsToUpdate, jsToUpdate);
  };

  let pushRequests = (requests, js) => {
    let id = Date.now();
    let chunk = {
      [id]: {
        requests: LZString.compressToUTF16(JSON.stringify(requests)),
        js: LZString.compressToUTF16(JSON.stringify(js)),
      }
    };

    chrome.storage.local.set(chunk, () => {
      chrome.storage.local.get("indexes", (result) => {
        if (result.hasOwnProperty("indexes")) {
          result.indexes.push(id);
        } else {
          result.indexes = [id];
        }
        chrome.storage.local.set(result, null);
      });
    });

    // chrome.runtime.sendMessage({ requests: requests });
  };

  return {
    isLoaded: () => load(),

    setInterval: (interval) => chunkSize = interval,

    add: (request) => {
      requestsQueue.push(request);
      (requestsQueue.length >= chunkSize) ?
        scheduleWorker(0) :
        null;
    },

    addEvent: (js) => {
      jsQueue = jsQueue.concat(js);
    },

    get: () => ({ requests: requestsQueue, js: jsQueue }),
  };

})();