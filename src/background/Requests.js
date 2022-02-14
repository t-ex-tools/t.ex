var Requests = (() => {
  let requestsQueue = [];
  let jsQueue = [];
  let crypt = new JSEncrypt({default_key_size: 2048});
  let pubKey = null;
  let aesKey = null;
  let encAesKey = null;
  let chunkSize = 1500;

  let load = (() => {
    chrome.storage.local.get(["publicKey", "settingsChunkSize", "settingsEncryption"], (result) => {
      (
        result.hasOwnProperty("publicKey") && 
        result.hasOwnProperty("settingsEncryption") && 
        result.settingsEncryption
      ) ?
        Requests.setPubKey(result.publicKey) :

      (result.hasOwnProperty("settingsChunkSize")) ?
        (chunkSize = Number.parseInt(result.settingsChunkSize)) :
      
      null;
    });

    chrome.runtime.onMessage.addListener((message) => {
      (message.hasOwnProperty("pubKey")) ?
        Requests.setPubKey(message.pubKey) :

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
    let chunk;
    if (pubKey) {
      chunk = {
        requests: sjcl.encrypt(aesKey, LZString.compressToUTF16(JSON.stringify(requests))),
        js: sjcl.encrypt(aesKey, LZString.compressToUTF16(JSON.stringify(js))),
        aesKey: encAesKey
      };
    } else {
      chunk = {
        requests: LZString.compressToUTF16(JSON.stringify(requests)),
        js: LZString.compressToUTF16(JSON.stringify(js)),
      };
    }
    let chunkWrap = {};
    let currentId = Date.now();
    chunkWrap[currentId] = chunk;
    
    chrome.storage.local.set(chunkWrap, () => {
      chrome.storage.local.get("indexes", (result) => {
        if (result.hasOwnProperty("indexes")) {
          result.indexes.push(currentId);
        } else {
          result.indexes = [currentId];
        }
        chrome.storage.local.set(result, null);
      });
    });

    chrome.runtime.sendMessage({requests: requests});
  };

  return {
    isLoaded: () => load(),

    getPubKey: () => pubKey,

    setPubKey: (publicKey) => {
      pubKey = publicKey;
      crypt.setPublicKey(publicKey);
      aesKey = Requests.generateRandomKey();
      encAesKey = crypt.encrypt(aesKey)
    },

    setInterval: (interval) => chunkSize = interval,

    add: (request) => {
      requestsQueue.push(request);
      (requestsQueue.length >= chunkSize) ?
        scheduleWorker(0) :
        null;
    },

    addEvent: (js) => {
      jsQueue = jsQueue.concat(js);
      (jsQueue.length >= chunkSize * 2) ?
        scheduleWorker(0) :
        null;
    },

    get: () => ({requests: requestsQueue, js: jsQueue}),
  
    dec2hex: (dec) => ("0" + dec.toString(16)).substr(-2),
  
    generateRandomKey: () => {
      var arr = new Uint8Array((12 || 40) / 2);
      window.crypto.getRandomValues(arr);
      return Array.from(arr, Requests.dec2hex).join("");
    }
  };
  
})();