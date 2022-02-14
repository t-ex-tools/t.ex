import FeatureExtractor from "../FeatureExtractor.js";
import Statistics from "../Statistics.js";

var BodyFeatures = (() => {

  let extractBody = (r) => (r.requestBody) ?
    FeatureExtractor.cache(SparkMD5.hash(JSON.stringify(r.requestBody)),
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
    "requests.requestBody": {
      title: "Request Body",
      subtitle: "Content of the request body.",
      impl: (r) => extractBody(r),
      lom: 1,
      cardinalityType: 1,
    },
    "requests.requestBody.keyLength.total": {
      title: "RB | Lengths of keys",
      subtitle: "Total lengths of keys in the request's body.",
      impl: (r) => Statistics.total(kLengths(r)),
      lom: 4,
      cardinalityType: 2,
    },
    "requests.requestBody.valueLength.total": {
      title: "RB | Lengths of values",
      subtitle: "Total lengths of values in the request's body.",
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