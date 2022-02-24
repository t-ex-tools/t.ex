import FeatureExtractor from "../FeatureExtractor.js";
import Statistics from "../Statistics.js";

var UrlFeatures = (() => {

  let url = (r) => FeatureExtractor.cache(r.url, () => new URL(r.url));
  let params = (r) => [...url(r).searchParams.entries()];
  
  let kLengths = (r) => FeatureExtractor.lengths("url.query.keyLengths@" + r.url, params(r), 0);
  let vLengths = (r) => FeatureExtractor.lengths("url.query.valueLengths@" + r.url, params(r), 1);

  const features = {
    "http.url.source": { 
      title: "Source", 
      subtitle: "The full URL of the source of the request.",
      impl: (r) => {
        try {
          let source = new URL(r.source);
          return source.hostname;
        } catch (err) {
          return undefined;
        }
      },
      lom: 1,
      cardinalityType: 0,
    },
    "http.url.hostname": { 
      title: "Hostname", 
      subtitle: "The Hostname of the target URL.",
      impl: (r) => url(r).hostname,
      lom: 1,
      cardinalityType: 0,
    },
    "http.url.pathname": { 
      title: "Path name", 
      subtitle: "The path name of the target URL.",
      impl: (r) => url(r).pathname,
      lom: 1,
      cardinalityType: 0,
    },
    "http.url.filetype": { 
      title: "File type", 
      subtitle: "The file type extension of the target URL's path.",
      impl: (r) => {
        let path = url(r).pathname.split(".");
        return path[path.length-1];
      },
      lom: 1,
      cardinalityType: 0,
    },
    "http.url.jsurls": { 
      title: "JavaScript URLs", 
      subtitle: "Explicit JavaScript URLs.",
      impl: (r) => {
        let path = url(r).pathname.split("/");
        let filename = path[path.length-1];
        return (filename.endsWith(".js")) ? r.url : undefined;
      },
      lom: 1,
      cardinalityType: 0,
    },
    "http.url.jsfiles": { 
      title: "JavaScript files", 
      subtitle: "Explicitly requested JavaScript files.",
      impl: (r) => {
        let path = url(r).pathname.split("/");
        let filename = path[path.length-1];
        return (filename.endsWith(".js")) ? filename : undefined;
      },
      lom: 1,
      cardinalityType: 0,
    },
    "http.url.protocol": { 
      title: "Protocol", 
      subtitle: "The protocol used for the target URL.", 
      impl: (r) => url(r).protocol,
      lom: 1,
      cardinalityType: 0,
    },
    "http.url.query": { 
      title: "Query Parameters", 
      subtitle: "Key-value pairs in search string.",
      impl: (r) => params(r),
      lom: 1,
      cardinalityType: 1,
    },
    "http.url.query.keys": { 
      title: "Query Parameters Keys", 
      subtitle: "Key-value pairs in search string.",
      impl: (r) => params(r).map((e) => e[0]),
      lom: 1,
      cardinalityType: 1,
    },
    "http.url.query.values": { 
      title: "Query Parameters Values", 
      subtitle: "Key-value pairs in search string.",
      impl: (r) => params(r).map((e) => e[1]),
      lom: 1,
      cardinalityType: 1,
    },
    "http.url.query.nkvp": { 
      title: "Number of query parameters", 
      subtitle: "Number of key-value pairs in search string.",
      impl: (r) => params(r).length,
      lom: 4,
      cardinalityType: 2,
    },
    "http.url.query.keyLength.total": { 
      title: "QP | Lengths of keys", 
      subtitle: "Total length of the query parameters' keys.",
      impl: (r) => Statistics.total(kLengths(r)),
      lom: 4,
      cardinalityType: 2,
    },
    "http.url.query.valueLength.total": { 
      title: "QP | Lengths of values", 
      subtitle: "Total length of the query parameters' values.",
      impl: (r) => Statistics.total(vLengths(r)),
      lom: 4,
      cardinalityType: 2,
    }, 
  };

  return {
    features: () => features,
  };

})();

export default UrlFeatures;