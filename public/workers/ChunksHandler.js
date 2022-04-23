var ChunksHandler = (() => {
  let cache = {};

  return {
    process: (msg, self) => {
      let data = msg.data.data;
      let type = msg.data.type;
      let port = msg.data.port;
      let total = data.chunk[type].size;

      let set = JSON.parse(
        LZString.decompressFromUTF16(
          data.chunk[type].data
        )
      );      
    
      if (cache[type] && cache[type][data.index]) {
        self.postMessage({
          port: port, 
          chunk: set
            .map((r, i) => {
              r.labels = cache[type][data.index][i];
              return r; 
            }),
          loaded: cache[type][data.index].length,
          total: cache[type][data.index].length,
        });

        return;
      }

      set
        .filter((r) => r)
        .forEach((r, i) => {
          r.labels = blocklists.map((e) => e.isLabeled(r));
        
          if (i === set.length-1) {
            if (!cache[type]) {
              cache[type] = [];
            }
            cache[type][data.index] = set.map((e) => e.labels);
          }

          self.postMessage({
            port: port,
            chunk: (i === set.length-1) 
              ? set 
              : null,
            loaded: i + 1,
            total: total
          });
        });

    }
  };
})();