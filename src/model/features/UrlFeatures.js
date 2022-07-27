import FeatureExtractor from "./FeatureExtractor.js";
import Statistics from "../data/Statistics.js";

var UrlFeatures = (() => {

  let url = (r) => {
    let url;
    try {
      if (r.url) {
        url = new URL(r.url);
      } else if (r.response) {
        url = new URL (r.response.url);
      } else {
        url = {};
      }
    } catch(err) {
      url = {}
    }

    return url;
  };
  
  let params = (r) => {
    let u = url(r);
    return (u.searchParams)
      ? [...u.searchParams.entries()]
      : []
  };

  let lengths = (r, i) => 
    FeatureExtractor.lengths(params(r), i);

  const features = {
    "http.url.hostname": { 
      title: "Host name", 
      subtitle: "The hostname of the target URL",
      impl: (r) => url(r).hostname,
      lom: 1,
      cardinalityType: 0,
    },
    "http.url.pathname": { 
      title: "Path name", 
      subtitle: "The path name of the target URL",
      impl: (r) => url(r).pathname,
      lom: 1,
      cardinalityType: 0,
    },
    "http.url.filetype": { 
      title: "File type", 
      subtitle: "The file type extension of the target URL's path",
      impl: (r) => url(r).pathname.split(".").pop(),
      lom: 1,
      cardinalityType: 0,
    },
    "http.url.filename": { 
      title: "File name", 
      subtitle: "The name of the requested file",
      impl: (r) => url(r).pathname.split("/").pop(),
      lom: 1,
      cardinalityType: 0,
    },
    "http.url.protocol": { 
      title: "Protocol", 
      subtitle: "The protocol used to request the target", 
      impl: (r) => url(r).protocol,
      lom: 1,
      cardinalityType: 0,
    },
    "http.url.query.fields": { 
      title: "Query parameters", 
      subtitle: "Key-value pairs in search string",
      impl: (r) => params(r),
      lom: 1,
      cardinalityType: 1,
    },
    "http.url.query.keys": { 
      title: "Query parameter keys", 
      subtitle: "Keys of the query parameters",
      impl: (r) => params(r).map((e) => e[0]),
      lom: 1,
      cardinalityType: 1,
    },
    "http.url.query.values": { 
      title: "Query parameters values", 
      subtitle: "Values of the query parameters",
      impl: (r) => params(r).map((e) => e[1]),
      lom: 1,
      cardinalityType: 1,
    },
    "http.url.query.nkvp": { 
      title: "#Query parameters", 
      subtitle: "Number of query parameters",
      impl: (r) => params(r).length,
      lom: 4,
      cardinalityType: 2,
    },
    "http.url.query.keyLength.total": { 
      title: "Key length", 
      subtitle: "Total length of query parameter keys",
      impl: (r) => Statistics.sum(lengths(r, 0)),
      lom: 4,
      cardinalityType: 2,
    },
    "http.url.query.valueLength.total": { 
      title: "Value length", 
      subtitle: "Total length of query parameter values",
      impl: (r) => Statistics.sum(lengths(r, 1)),
      lom: 4,
      cardinalityType: 2,
    }, 
  };

  return {
    features: () => features
  };

})();

export default UrlFeatures;