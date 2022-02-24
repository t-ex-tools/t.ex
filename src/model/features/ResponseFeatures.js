import FeatureExtractor from "../FeatureExtractor.js";
import Statistics from "../Statistics.js";

var ResponseFeatures = (() => {

  let header = (r) => (r.response.responseHeaders) ?
    FeatureExtractor.cache(JSON.stringify(r.response.responseHeaders),
      () => [...r.response.responseHeaders.map((e) => Object.values(e))])
    : [];
    
  let kLengths = (r) => FeatureExtractor.lengths("responseHeaders.keyLengths@" + JSON.stringify(r.response.responseHeaders), header(r), 0);
  let vLengths = (r) => FeatureExtractor.lengths("responseHeaders.valueLengths@" + JSON.stringify(r.response.responseHeaders), header(r), 1);

  const features = {
    "http.response.statusCode": {
      title: "Response Status Code",
      subtitle: "Status Code of the HTTP Response.",
      impl: (r) => r.response.statusCode,
      lom: 1,
      cardinalityType: 1,
    },
    "http.response.fromCache": {
      title: "Response from Cache",
      subtitle: "Whether HTTP Response was served from cache or not.",
      impl: (r) => r.response.fromCache,
      lom: 1,
      cardinalityType: 1,
    },    
    "http.responseHeaders": {
      title: "Response Headers",
      subtitle: "Header fields of the response.",
      impl: (r) => header(r),
      lom: 1,
      cardinalityType: 1,
    },
    "http.responseHeaders.keys": {
      title: "Response Headers Keys",
      subtitle: "Header fields of the response.",
      impl: (r) => header(r).map((e) => e[0]),
      lom: 1,
      cardinalityType: 1,
    },
    "http.responseHeaders.values": {
      title: "Response Headers Values",
      subtitle: "Header fields of the response.",
      impl: (r) => header(r).map((e) => e[1]),
      lom: 1,
      cardinalityType: 1,
    },
    "http.responseHeaders.nkvp": {
      title: "RSP | Number of header fields",
      subtitle: "Number of key-value pairs in the response's header fields.",
      impl: (r) => header(r).length,
      lom: 4,
      cardinalityType: 2,
    },
    "http.responseHeaders.keyLength.total": {
      title: "RSP | Lengths of keys",
      subtitle: "Total length of the header fields' keys.",
      impl: (r) => Statistics.total(kLengths(r)),
      lom: 4,
      cardinalityType: 2,
    },
    "http.responseHeaders.valueLength.total": {
      title: "RSP | Lengths of values",
      subtitle: "Total length of the header fields' values.",
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

export default ResponseFeatures;