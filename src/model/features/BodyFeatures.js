import FeatureExtractor from "./FeatureExtractor.js";
import Statistics from "../data/Statistics.js";

var BodyFeatures = (() => {

  let body = (r) => {
    
    if (!r.requestBody) {
      return [];
    }

    if (r.requestBody.raw) {
      return [["raw", new TextDecoder("utf-8").decode(r.requestBody.raw.bytes)]];
    } else if (r.requestBody.formData) {
      return [...Object.entries(r.requestBody.formData)];
    } else {
      return [...Object.entries(r.requestBody)];
    }      
  };

  let lengths = (r, i) => 
    FeatureExtractor.lengths(body(r), i);

  const features = {
    "http.requestBody.fields": {
      title: "Request body",
      subtitle: "Content of the request body",
      impl: (r) => body(r),
      lom: 1,
      cardinalityType: 1,
    },
    "http.requestBody.keyLength.total": {
      title: "Key length",
      subtitle: "Total length of keys in the request body",
      impl: (r) => Statistics.sum(lengths(r, 0)),
      lom: 4,
      cardinalityType: 2,
    },
    "http.requestBody.valueLength.total": {
      title: "Value length",
      subtitle: "Total length of values in the request body",
      impl: (r) => Statistics.sum(lengths(r, 1)),
      lom: 4,
      cardinalityType: 2,
    },
  };

  return {
    features: () => features,
  };

})();

export default BodyFeatures;