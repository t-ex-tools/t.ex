import FeatureExtractor from "../FeatureExtractor.js";
import Statistics from "../Statistics.js";

var BodyFeatures = (() => {

  let extractBody = (r) => (r.requestBody) ?
    FeatureExtractor.cache(FeatureExtractor.hash(JSON.stringify(r.requestBody)),
      () => (r.requestBody) ?
        (r.requestBody.raw) ?
          [["raw", new TextDecoder("utf-8").decode(r.requestBody.raw.bytes)]]
          : (r.requestBody.formData) ?
            [...Object.entries(r.requestBody.formData)]
            : [...Object.entries(r.requestBody)]
        : [])
    : [];

  let kLengths = (r) => FeatureExtractor.lengths("requestBody.keyLength@" + JSON.stringify(r.requestBody), extractBody(r), 0);
  let vLengths = (r) => FeatureExtractor.lengths("requestBody.valueLength@" + JSON.stringify(r.requestBody), extractBody(r), 1);

  const features = {
    "http.requestBody": {
      title: "Request body",
      subtitle: "Content of the request body",
      impl: (r) => extractBody(r),
      lom: 1,
      cardinalityType: 1,
    },
    "http.requestBody.keyLength.total": {
      title: "Key length",
      subtitle: "Total length of keys in the request body",
      impl: (r) => Statistics.total(kLengths(r)),
      lom: 4,
      cardinalityType: 2,
    },
    "http.requestBody.valueLength.total": {
      title: "Value length",
      subtitle: "Total length of values in the request body",
      impl: (r) => Statistics.total(vLengths(r)),
      lom: 4,
      cardinalityType: 2,
    },
  };

  return {
    features: () => features,
  };

})();

export default BodyFeatures;