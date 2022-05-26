var ChunksPreprocessor = (() => {
  let transform = {
    http: (r) => {
      let params = {};
          
      params.url = (!r.url && r.response) 
        ? r.response.url 
        : r.url;

      params.domain = undefined;
      if (r.initiator) {
        params.domain = r.initiator;
      } else if (r.response && r.response.initiator) {
        params.domain = r.response.initiator
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
          params.domain = referer.value;
        } else if (origin) {
          params.domain = origin.value
        }
      }

      params.type = (r.type)
        ? r.type
        : r.response.type;

      return params;
    },
    js: (r) => ({
      url: r.url,
      domain: r.source,
      type: "script"
    })
  };

  let filter = {
    http: (r) => {
      return r.url !== undefined && 
        r.response !== undefined &&
        r.success;
    },
    js: (r) => {
      return r &&
        r.url &&
        r.source &&
        r.type;
    }
  };

  return {
    transform: transform,
    filter: filter
  };
})();