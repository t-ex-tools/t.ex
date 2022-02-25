import LZString from "../libs/lz-string/lz-string.min.js";

var Chunk = (() => {
  let queue = {
    http: [],
    js: []
  };
  let chunkSize = 1500;

  chrome.storage.local.get("settings")
    .then((res) => {
      chunkSize = (res.settings && res.settings.chunkSize)
        ? res.settings.chunkSize
        : chunkSize;
    });

  chrome.runtime
    .onMessage
    .addListener((msg) => {

      if (msg.hasOwnProperty("flush")) {
        save([...queue.http], [...queue.js]),
          queue.http = [];
        queue.js = [];
      }

      if (msg.hasOwnProperty("js")) {
        Chunk.add("js", msg.js);
      }

      if (msg.hasOwnProperty("chunkSize")) {
        chunkSize = Number.parseInt(msg.chunkSize)
      }
    });

  let check = () => {
    let completed = queue.http.filter((e) => e.complete);

    if (completed.length < chunkSize) {
      return;
    }

    console.debug("#HTTP: " + completed.length);
    console.debug("#JS: " + queue.js.length);

    save(completed, [...queue.js]);
    queue.http = queue.http.filter((e) => !e.complete);
    queue.js = [];
  };

  let save = (http, js) => {
    let id = Date.now()
    let chunk = {
      [id]: {
        http: LZString.compressToUTF16(JSON.stringify(http)),
        js: LZString.compressToUTF16(JSON.stringify(js)),
      }
    };

    chrome.storage.local.set(chunk)
      .then(() => {
        console.debug("Chunk saved.")

        chrome.storage.local.get("indexes")
          .then((res) => {
            if (res.hasOwnProperty("indexes")) {
              res.indexes.push(id);
            } else {
              res.indexes = [id];
            }
            chrome.storage.local.set(res);
          });
      });
  };

  return {
    add: (type, data) => {
      queue[type] = queue[type].concat(data);
      if (queue.http.length % 100 === 0) {
        console.debug("Queue size: " + queue.http.length);
      }
      if (chunkSize <= queue.http.length) {
        check();
      }
    },
  };

})();

export default Chunk;