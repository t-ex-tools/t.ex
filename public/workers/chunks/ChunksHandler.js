var ChunksHandler = (() => {
  let cache = {};
  const interval = 1250; 

  return {
    process: (msg, handler) => {
      let data = msg.data.data;
      let type = msg.data.type;

      let set = JSON.parse(
        LZString.decompressFromUTF16(
          data.chunk[type].data
        )
      ).filter(ChunksPreprocessor.filter[type]);

      if (set.length === 0) {
        handler([], data.index, 0, 0);
      }
    
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
        .forEach((r, i) => {
          let params = ChunksPreprocessor.transform[type](r);
          r.labels = blocklists.map((e) => e.isLabeled(params));
        
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