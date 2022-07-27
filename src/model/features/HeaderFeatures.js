import FeatureExtractor from "./FeatureExtractor.js";
import Statistics from "../data/Statistics.js";

var HeaderFeatures = (() => {

  let header = (r) => (r.requestHeaders) 
    ? [...r.requestHeaders.map((e) => Object.values(e))]
    : [];
  
  let get = (header, field) => {
    let value = header
      .filter((h) => h[0].toLowerCase && h[0].toLowerCase() === field);
    if (value.length > 0) {
      return value[0][1];
    } else {
      return undefined;
    }
  }

  let lengths = (r, i) => 
    FeatureExtractor.lengths(header(r), i);

  const features = {
    "http.requestHeaders.fields": {
      title: "Request headers",
      subtitle: "Header fields of the HTTP/S request",
      impl: (r) => header(r),
      lom: 1,
      cardinalityType: 1,
    },
    "http.requestHeaders.keys": {
      title: "Header keys",
      subtitle: "Keys of the HTTP/S header fields",
      impl: (r) => header(r).map((e) => e[0]),
      lom: 1,
      cardinalityType: 1,
    },
    "http.requestHeaders.values": {
      title: "Headers values",
      subtitle: "Values of the HTTP/S header fields",
      impl: (r) => header(r).map((e) => e[1]),
      lom: 1,
      cardinalityType: 1,
    },
    "http.requestHeaders.referer": {
      title: "HTTP Referrer",
      subtitle: "The value of the HTTP-Referer field",
      impl: (r) => get(header(r), "referer"),
      lom: 1,
      cardinalityType: 1,
    },    
    "http.requestHeaders.origin": {
      title: "HTTP Origin",
      subtitle: "The value of the HTTP-Origin field",
      impl: (r) => get(header(r), "origin"),
      lom: 1,
      cardinalityType: 1,
    },
    "http.requestHeaders.nkvp": {
      title: "Header fields",
      subtitle: "Number of key-value pairs in the request header",
      impl: (r) => header(r).length,
      lom: 4,
      cardinalityType: 2,
    },
    "http.requestHeaders.keyLength.total": {
      title: "Key length",
      subtitle: "Total length of the header keys",
      impl: (r) => Statistics.sum(lengths(r, 0)),
      lom: 4,
      cardinalityType: 2,
    },
    "http.requestHeaders.valueLength.total": {
      title: "Value length",
      subtitle: "Total length of the header values",
      impl: (r) => Statistics.sum(lengths(r, 1)),
      lom: 4,
      cardinalityType: 2,
    },
  };

  return {
    features: () => features,
    header: header,
    get: get
  }

})();

export default HeaderFeatures;