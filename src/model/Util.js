var Util = (() => {
  let Labeler = new Worker("../workers/Labeler.js", { type: "module" });

  return {
    
    labeledStream: (chunks, type, handler) => {
      let port = Util.randomString();
      
      Labeler.postMessage({ 
        port: port, 
        chunks: Object.values(chunks), 
        type: type 
      });

      Labeler.addEventListener("message", (msg) => {
        if (msg.data.port === port) {
          handler(msg.data.chunk, msg.data.loaded, msg.data.total);
        }
      })
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