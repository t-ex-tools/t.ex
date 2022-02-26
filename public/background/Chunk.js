import LZString from "../js/lz-string.min.js";
import config from "../js/Settings.js";

var Chunk = (() => {
  let queue = {
    http: [],
    js: []
  };
  let settings = {
    chunkSize: config.chunkSize.default,
    backgroundRecording: config.backgroundRecording.default
  };
  let recording = false;

  chrome.storage.local.get("settings")
    .then((res) => {
      if (res.settings) {
        Chunk.set(res.settings);
      }
    });

  chrome.runtime
    .onMessage
    .addListener((msg) => {

      if (msg.hasOwnProperty("flush")) {
        save([...queue.http], [...queue.js]);
        queue.http = [];
        queue.js = [];
      }

      if (msg.hasOwnProperty("js")) {
        Chunk.add("js", msg.js);
      }

      if (msg.hasOwnProperty("settings")) {
        Chunk.set(msg.settings)
      }
    });

  let check = () => {
    let completed = queue.http.filter((e) => e.complete);

    if (completed.length < settings.chunkSize) {
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
      if (recording || settings.backgroundRecording) {
        queue[type] = queue[type].concat(data);
      }
      
      if (queue.http.length % 100 === 0) {
        console.debug("Queue size: " + queue.http.length);
      }
      if (settings.chunkSize <= queue.http.length) {
        check();
      }
    },
    set: (config) => {
      Object
        .keys(settings)
        .forEach((k) => {
          settings[k] = (config.hasOwnProperty(k))
            ? config[k] 
            : settings[k];
          console.debug("Set " + k + " to " + settings[k]);
        });
    }
  };

})();

export default Chunk;