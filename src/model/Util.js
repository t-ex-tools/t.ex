import config from "./Settings.js";

var Util = (() => {
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
        settings.numberOfWorkers = res.settings.numberOfWorkers;
        settings.chunksAtOnce = res.settings.chunksAtOnce;
        settings.chunkSize = res.settings.chunkSize;
        settings.jsChunkSize = res.settings.jsChunkSize;
      }

      for (let i=1; i < settings.numberOfWorkers; i++) {
        labelers[i] = new Worker("../workers/Labeler.js");
      }
    });

  return {

    setIndexes: function(idx) {
      indexes = idx;
    },

    stream: (type, handler) => {
      let port = Util.randomString();
      let est = approx[type]() * indexes.length;

      let loaded = new Array(settings.numberOfWorkers)
        .fill(0);
      
      let total = new Array(settings.numberOfWorkers)
        .fill(est / settings.numberOfWorkers);

      labelers
        .forEach((l, i) => {
          l.addEventListener("message", (msg) => {
            if (msg.data.port === port) {
              loaded[i] = msg.data.loaded;
              total[i] = msg.data.total;
              let x = loaded.reduce((a, b) => a + b, 0);
              let y = total.reduce((a, b) => a + b, 0);
              handler(msg.data.chunk, x, y);
            }
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
    },

    // https://stackoverflow.com/a/8084248
    // from doubletap's answer on Nov 10, 2011 at 18:12
    randomString: () => 
      (Math.random()+1).toString(36).substring(2) + 
      (Math.random()+1).toString(36).substring(2),
    
    // https://gist.github.com/zensh/4975495
    // from zensh's gist created on 18 Feb 2013.
    memorySizeOf: function(obj) {
      var bytes = 0;
  
      function sizeOf(obj) {
          if(obj !== null && obj !== undefined) {
              switch(typeof obj) {
              case "number":
                  bytes += 8;
                  break;
              case "string":
                  bytes += obj.length * 2;
                  break;
              case "boolean":
                  bytes += 4;
                  break;
              case "object":
                  var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                  if(objClass === "Object" || objClass === "Array") {
                      for(var key in obj) {
                          if(!obj.hasOwnProperty(key)) continue;
                          sizeOf(obj[key]);
                      }
                  } else bytes += obj.toString().length * 2;
                  break;
              }
          }
          return bytes;
      };
  
      return sizeOf(obj);
    },
  };
})();

export default Util;