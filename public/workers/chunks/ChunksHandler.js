var ChunksHandler = (() => {
  let cache = {};
  const interval = 250; 

  return {
    process: (msg, handler) => {
      let data = msg.data.data;
      let type = msg.data.type;

      let set = JSON.parse(
        LZString.decompressFromUTF16(
          data.chunk[type].data
        )
      ).filter(ChunksPreprocessor.filter[type]);
    
      if (cache[type] && cache[type][data.index]) {
        let chunk = set
          .map((r, i) => {
            r.labels = cache[type][data.index][i];
            return r; 
          })
        
        handler(
          chunk, 
          data.index, 
          set.length,
          set.length
        );

        return;
      }
      
      set
        .map(ChunksPreprocessor.transform[type])
        .forEach((r, i) => {
          r.labels = blocklists.map((e) => e.isLabeled(r));
          delete r.params;
        
          if (i === set.length-1) {
            if (!cache[type]) {
              cache[type] = [];
            }
            cache[type][data.index] = set.map((e) => e.labels);
          }

          let chunk = (i === set.length-1) 
            ? set 
            : null;

          if (i % interval === 0 ||
              i === set.length-1) {
                handler(
                  chunk, 
                  data.index, 
                  i + 1,
                  set.length
                );
              }
        });

    }
  };
})();