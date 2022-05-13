var ChunksPreprocessor = (() => {
  let transform = {
    http: (r) => {
      r.params = {};
          
      r.params.target = (!r.url && r.response) 
        ? r.response.url 
        : r.url;

      r.params.source = undefined;
      if (r.initiator) {
        r.params.source = r.initiator;
      } else if (r.response && r.response.initiator) {
        r.params.source = r.response.initiator
      } else if (r.requestHeaders) {
        let referer = r.requestHeaders
          .find((h) => 
            h.name.toLowerCase() === "referer"
          );

        let origin = r.requestHeaders
          .find((h) => 
            h.name.toLowerCase() === "origin"
          );

        if (referer) {
          r.params.source = referer.value;
        } else if (origin) {
          r.params.source = origin.value
        }
      }

      return r;
    },
    js: (r) => {
      r.params = {};
      r.params.target = r.url;
      r.params.source = r.source;
      return r;
    }
  };

  let filter = {
    http: (r) => {
      return r.url !== undefined && 
        r.response !== undefined &&
        r.success;
    },
    js: (r) => {
      return true;
    }
  };

  return {
    transform: transform,
    filter: filter
  };
})();