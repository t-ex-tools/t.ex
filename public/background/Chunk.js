import config from "../js/Settings.js";

var Chunk = (() => {
  let queue = {
    http: [],
    js: []
  };
  let settings = {
    chunkSize: config.chunkSize.default,
    jsChunkSize: config.jsChunkSize.default,
    backgroundRecording: config.backgroundRecording.default
  };
  let recording = false;

  browser.storage.local.get("settings")
    .then((res) => {
      if (res.settings) {
        Chunk.set(res.settings);
      }
    });

  browser.runtime
    .onMessage
    .addListener((msg, sender, response) => {

      if (msg.hasOwnProperty("flush")) {
        let id = Date.now();
        save([...queue.http], [...queue.js], id);
        queue.http = [];
        queue.js = [];
        return Promise.resolve(id);
      }

      if (msg.hasOwnProperty("js")) {
        Chunk.add("js", JSON.parse(msg.js));
        return Promise.resolve();
      }

      if (msg.hasOwnProperty("settings")) {
        Chunk.set(msg.settings)
      }

      if (msg.hasOwnProperty("recording")) {
        recording = msg.recording;
        console.debug("Background: Recording set to " + recording)
      }
    });

  let check = () => {
    console.debug("#HTTP: " + queue.http.length);
    console.debug("#JS: " + queue.js.length);

    let http = queue.http.splice(0, settings.chunkSize);
    let js = queue.js.splice(0, settings.jsChunkSize);
    save(http, js, Date.now());
  };

  let save = (http, js, id) => {
    let chunk = {
      [id]: {
        http: {
          data: LZString.compressToUTF16(JSON.stringify(http)),
          size: http.length
        },
        js: {
          data: LZString.compressToUTF16(JSON.stringify(js)),
          size: js.length
        },
        version: browser.runtime.getManifest().version
      }
    };

    browser.storage.local.set(chunk)
      .then(() => {
        console.debug("Chunk saved.")

        browser.storage.local.get("indexes")
          .then((res) => {
            if (res.hasOwnProperty("indexes")) {
              res.indexes.push(id);
            } else {
              res.indexes = [id];
            }
            browser.storage.local.set(res);
          });
      });
  };

  return {
    add: (type, data) => {
      if (recording || settings.backgroundRecording) {
        queue[type] = queue[type].concat(data);
      }
      
      if (queue.http.length % 100 === 0 &&
          queue.http.length > 0) {
        console.debug("Queue size: " + queue.http.length);
      }
      if (settings.chunkSize <= queue.http.length ||
          settings.jsChunkSize <= queue.js.length) {
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