import FeatureExtractor from "../FeatureExtractor.js";
import Statistics from "../Statistics.js";

var HeaderFeatures = (() => {

  let header = (r) => (r.requestHeaders) ?
    FeatureExtractor.cache(JSON.stringify(r.requestHeaders),
      () => [...r.requestHeaders.map((e) => Object.values(e))])
    : [];
    
  let kLengths = (r) => FeatureExtractor.lengths("requestHeaders.keyLengths@" + JSON.stringify(r.requestHeaders), header(r), 0);
  let vLengths = (r) => FeatureExtractor.lengths("requestHeaders.valueLengths@" + JSON.stringify(r.requestHeaders), header(r), 1);

  const features = {
    "http.requestHeaders": {
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
      impl: (r) => Statistics.total(kLengths(r)),
      lom: 4,
      cardinalityType: 2,
    },
    "http.requestHeaders.valueLength.total": {
      title: "Value length",
      subtitle: "Total length of the header values",
      impl: (r) => Statistics.total(vLengths(r)),
      lom: 4,
      cardinalityType: 2,
    },
  };

  return {
    features: () => features,
    extractHeader: header,
  }

})();

export default HeaderFeatures;