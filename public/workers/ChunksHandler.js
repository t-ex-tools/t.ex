var ChunksHandler = (() => {
  let data = [];
  let cache = {};

  return {
    pass: (chunks) => {
      data = data.concat(chunks);
    },

    process: (type, port, self) => {
      let total = data
        .reduce((acc, val) => acc + val[type].size, 0);

      data
        .forEach((chunk, index) => {
    
          if (cache[type] && cache[type][index]) {

            self.postMessage({
              port: port, 
              chunk: cache[type][index],
              loaded: cache[type][index].length,
              total: cache[type][index].length,
            });

            return;
          }

          let set = JSON.parse(
              LZString.decompressFromUTF16(
                chunk[type].data
              )
            );

          set
            .filter((r) => r)
            .forEach((r, i) => {
              r.labels = blocklists.map((e) => e.isLabeled(r));
            
              if (i === set.length-1) {
                if (!cache[type]) {
                  cache[type] = [];
                }
                cache[type][index] = set;
              }
    
              self.postMessage({
                port: port,
                chunk: (i === set.length-1) 
                  ? set 
                  : null,
                loaded: data
                  .slice(0, index)
                  .reduce((acc, val) => 
                    acc + val[type].size
                  , 0) 
                  + i + 1,
                total: total
              });
            });
        });
    }
  };
})();