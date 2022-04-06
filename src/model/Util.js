import { toRaw } from "vue";

var Util = (() => {
  let cpus = navigator.hardwareConcurrency;
  let labelers = [];
  for (let i=0; i < cpus; i++) {
    labelers[i] = new Worker("../workers/Labeler.js");
  }

  return {

    data: (chunks) => {
      let data = Object.values(chunks);

      labelers
        .forEach((l, i) => {
          l.postMessage({ 
            method: "post",
            chunks: data.filter((chunk, j) => j % labelers.length === i),
          });
        });
    },
    
    stream: (type, handler) => {
      let port = Util.randomString();
      
      let loaded = new Array(cpus).fill(0);
      let total = new Array(cpus).fill(0);

      labelers
        .forEach((l, i) => {
          l.postMessage({
            method: "get",
            port: port,
            type: type 
          });

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
    },

    // TODO: close stream and remove listener from labelers

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
  
      function formatByteSize(bytes) {
          if (bytes < 1024) return bytes + " bytes";
          else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
          else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
          else return (bytes / 1073741824).toFixed(3) + " GiB";
      };
  
      return sizeOf(obj);
    },
  };
})();

export default Util;