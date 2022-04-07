import FeatureExtractor from "../FeatureExtractor.js";
import Statistics from "../Statistics.js";

var UrlFeatures = (() => {

  let url = (r) => FeatureExtractor.cache(r.url, () => new URL(r.url));
  let params = (r) => [...url(r).searchParams.entries()];
  
  let kLengths = (r) => FeatureExtractor.lengths("url.query.keyLengths@" + r.url, params(r), 0);
  let vLengths = (r) => FeatureExtractor.lengths("url.query.valueLengths@" + r.url, params(r), 1);

  const features = {
    "http.url.initiator": { 
      title: "Initiator", 
      subtitle: "The hostname of the initiator of the request",
      impl: (r) => {
        try {
          let source = new URL(r.initiator);
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
      impl: (r) => {
        let path = url(r).pathname.split(".");
        return path[path.length-1];
      },
      lom: 1,
      cardinalityType: 0,
    },
    "http.url.jsurls": { 
      title: "JavaScript URLs", 
      subtitle: "Explicit JavaScript URLs",
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
      subtitle: "Explicitly requested JavaScript files",
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
      subtitle: "The protocol used to request the target", 
      impl: (r) => url(r).protocol,
      lom: 1,
      cardinalityType: 0,
    },
    "http.url.query": { 
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
      impl: (r) => Statistics.total(kLengths(r)),
      lom: 4,
      cardinalityType: 2,
    },
    "http.url.query.valueLength.total": { 
      title: "Value length", 
      subtitle: "Total length of query parameter values",
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