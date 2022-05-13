import Util from "./Util.js";
import config from "./Settings.js";

var Data = (() => {
  let indexes = [];
  let labelers = [new Worker("../workers/Labeler.js")];
  let settings = {
    numberOfWorkers: config.numberOfWorkers.default,
    chunksAtOnce: config.chunksAtOnce.default,
    chunkSize: config.chunkSize.default,
    jsChunkSize: config.chunkSize.default
  };
  let approx = {
    http: () => settings.chunkSize,
    js: () => settings.jsChunkSize
  };

  browser.storage.local.get(["settings"])
    .then((res) => {
      if (res.settings) {
        Object
          .keys(settings)
          .forEach((k) => 
            settings[k] = (res.settings.hasOwnProperty(k)) 
            ? res.settings[k] 
            : settings[k]
          );
      }

      for (let i=1; i < settings.numberOfWorkers; i++) {
        labelers[i] = new Worker("../workers/Labeler.js");
      }
    });

  return {

    setIndexes: function(idx) {
      indexes = idx;
    },
    
    chunks: (handler) => {
      let loaded = 0;
      let total = indexes.length;

      for (let i=0; i * settings.chunksAtOnce < indexes.length; i++) {
        browser.storage.local
        .get(
          indexes.slice(
            i * settings.chunksAtOnce,
            (i + 1) * settings.chunksAtOnce
          )
        ).then((chunks) => {
          let c = Object.values(chunks)
          loaded += c.length;
          handler(c, loaded, total);
        });
      }
    },

    stream: (type, handler) => {
      let port = Util.randomString();
      let est = (approx[type]() * indexes.length) / settings.numberOfWorkers;

      let loaded = indexes
        .reduce((acc, val) => (acc[val] = 0, acc), {});

      let total = indexes
        .reduce((acc, val) => (acc[val] = est, acc), {});

      labelers
        .forEach((l, i) => {
          l.addEventListener("message", (msg) => {
            if (msg.data.port !== port) {
              return;
            }

            loaded[msg.data.index] = msg.data.loaded;
            total[msg.data.index] = msg.data.total;
            let x = Object.values(loaded).reduce((a, b) => a + b, 0);
            let y = Object.values(total).reduce((a, b) => a + b, 0);
            handler(msg.data.chunk, x, y);
          })
        });      

      for (let i=0; i * settings.chunksAtOnce < indexes.length; i++) {
        browser.storage.local
          .get(
            indexes.slice(
              i * settings.chunksAtOnce,
              (i + 1) * settings.chunksAtOnce
            )
          ).then((chunks) => {
            Object
              .keys(chunks)
              .forEach((key, idx) => {
                let index = i * settings.chunksAtOnce + idx;
                let l = labelers[index % labelers.length];
                total[key] = chunks[key][type].size;

                l.postMessage({
                  method: "get",
                  port: port,
                  data: {
                    index: key,
                    chunk: chunks[key]
                  },
                  type: type 
                });
              });
          });
      }
    },

    blocklists: (handler) => {
      let port = Util.randomString();

      labelers[0]
        .postMessage({ port: port, method: "lists" });

      labelers[0]
        .addEventListener("message", (msg) => {
          if (msg.data.port === port) {
            handler(msg.data.lists);
          }
        });
    }

  };
})();

export default Data;