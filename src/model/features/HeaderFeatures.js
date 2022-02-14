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
    "requests.requestHeaders": {
      title: "Request Headers",
      subtitle: "Header fields of the requests.",
      impl: (r) => header(r),
      lom: 1,
      cardinalityType: 1,
    },
    "requests.requestHeaders.keys": {
      title: "Request Headers Keys",
      subtitle: "Header fields of the requests.",
      impl: (r) => header(r).map((e) => e[0]),
      lom: 1,
      cardinalityType: 1,
    },
    "requests.requestHeaders.values": {
      title: "Request Headers Values",
      subtitle: "Header fields of the requests.",
      impl: (r) => header(r).map((e) => e[1]),
      lom: 1,
      cardinalityType: 1,
    },
    "requests.requestHeaders.nkvp": {
      title: "Number of header fields",
      subtitle: "Number of key-value pairs in the requests' header fields.",
      impl: (r) => header(r).length,
      lom: 4,
      cardinalityType: 2,
    },
    "requests.requestHeaders.keyLength.total": {
      title: "RH | Lengths of keys",
      subtitle: "Total length of the header fields' keys.",
      impl: (r) => Statistics.total(kLengths(r)),
      lom: 4,
      cardinalityType: 2,
    },
    "requests.requestHeaders.valueLength.total": {
      title: "RH | Lengths of values",
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

export default HeaderFeatures;