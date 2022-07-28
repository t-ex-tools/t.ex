import Util from "./Util.js";
import Storage from "../storage/Storage.js";
import Setting from "../classes/Setting.js";

var Data = (() => {
  let indexes = [];
  let labelers = [new Worker("../workers/Labeler.js")];
  let settings = {};
  let approx = {
    http: () => settings.chunkSize,
    js: () => settings.jsChunkSize
  };

  Setting.get(
    [
      "numberOfWorkers", 
      "chunksAtOnce", 
      "chunkSize", 
      "jsChunkSize"
    ],
    (cfg) => {
      settings = cfg;

      for (let i = 1; i < settings.numberOfWorkers; i++) {
        labelers[i] = new Worker("../workers/Labeler.js");
      }
    }
  );

  return {

    setIndexes: function (idx) {
      indexes = idx;
    },

    chunks: (handler) => {
      let loaded = 0;
      let total = indexes.length;

      for (let i = 0; i * settings.chunksAtOnce < indexes.length; i++) {
        Storage
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
      let start = Date.now();
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
            if (x === y) {
              console.debug("Labeling took: " + (Date.now() - start) + " ms");
            }
            handler(msg.data.chunk, x, y);
          })
        });

      for (let i = 0; i * settings.chunksAtOnce < indexes.length; i++) {
        Storage
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