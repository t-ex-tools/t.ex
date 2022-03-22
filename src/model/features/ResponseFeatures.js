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
      title: "Status Code",
      subtitle: "Status Code of the HTTP/S Response.",
      impl: (r) => r.response.statusCode,
      lom: 1,
      cardinalityType: 1,
    },
    "http.response.fromCache": {
      title: "Cache",
      subtitle: "Whether HTTP/S Response was served from cache",
      impl: (r) => r.response.fromCache,
      lom: 1,
      cardinalityType: 1,
    },    
    "http.responseHeaders": {
      title: "Response headers",
      subtitle: "Header fields of the response",
      impl: (r) => header(r),
      lom: 1,
      cardinalityType: 1,
    },
    "http.responseHeaders.keys": {
      title: "Headers keys",
      subtitle: "Keys of the response header fields",
      impl: (r) => header(r).map((e) => e[0]),
      lom: 1,
      cardinalityType: 1,
    },
    "http.responseHeaders.values": {
      title: "Headers values",
      subtitle: "Values of the response header fields",
      impl: (r) => header(r).map((e) => e[1]),
      lom: 1,
      cardinalityType: 1,
    },
    "http.responseHeaders.nkvp": {
      title: "Header fields",
      subtitle: "Number of key-value pairs in the response header",
      impl: (r) => header(r).length,
      lom: 4,
      cardinalityType: 2,
    },
    "http.responseHeaders.keyLength.total": {
      title: "Key length",
      subtitle: "Total length of the header field keys",
      impl: (r) => Statistics.total(kLengths(r)),
      lom: 4,
      cardinalityType: 2,
    },
    "http.responseHeaders.valueLength.total": {
      title: "Value length",
      subtitle: "Total length of the header field values",
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