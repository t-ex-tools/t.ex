var Util = (() => {
  let Labeler = new Worker(chrome.extension.getURL("app/workers/Labeler.js"));
  let Decompressor = new Worker(chrome.extension.getURL("app/workers/Decompressor.js"));

  let load = (() => {})();

  return {
    domainName: (hostname) => 
      hostname
        .split(".")
        .slice(-2)
        .join("."),

    isTracker: (hostname, dataset) => 
      typeof dataset[Util.domainName(hostname)] !== "undefined",

    stream: (data, handler) => {
      let port = Util.randomString();
      Decompressor.postMessage({port: port, data: data});
      Decompressor.addEventListener("message", (msg) => {
        if (msg.data.port === port && msg.data.chunk) {
          handler(msg.data.chunk, msg.data.currentChunk, msg.data.numberOfChunks);
        }
      })
    },
    
    labeledStream: (data, handler) => {
      let port = Util.randomString();
      Labeler.postMessage({port: port, data: data});
      Labeler.addEventListener("message", (msg) => {
        if (msg.data.port === port) {
          handler(msg.data.chunk, msg.data.currentChunk, msg.data.numberOfChunks);
        }
      })
    },

    toJsLiteral: (results, labels, totals, colType) => {
      let d = Object.entries(results.reduce((acc, col, index) => {
        Object.keys(col || {}).forEach((key) => {
          (!acc[key]) ? acc[key] = new Array(results.length).fill(0) : null;
          acc[key][index] = col[key];
        })
        return acc;
      }, {})).map((e) => [e[0], ...e[1]]);

      return {
        cols: [{
          id: "feature", 
          label: "Feature", 
          type: (colType) ? colType : "string"
        }, 
          ...labels.map((f) => ({id: f, label: f, type: "number"}))
        ],
        rows: d.map((e) => ({
          c: e.map((v, i) => 
            (i > 0) ? 
              (totals[i-1] > 0) ? {v: v * 100 / totals[i-1]} : {v: 0} 
            : {v: v})
          })
        ),
      };
    },

    // NOTE:  taken from SO -> https://stackoverflow.com/a/8084248
    //        only used to give group members an id
    //        no guaranteed uniqueness needed as number of group members
    //        expected to be rather low (never more than 100+)
    randomString: () => (Math.random()+1).toString(36).substring(2) + (Math.random()+1).toString(36).substring(2),
    
    // NOTE:  https://gist.github.com/zensh/4975495
    //        shall be only used temporarily for debugging purpose
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