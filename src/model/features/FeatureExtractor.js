import BodyFeatures from "./BodyFeatures.js";
import CookieFeatures from "./CookieFeatures.js";
import HeaderFeatures from "./HeaderFeatures.js";
import RequestFeatures from "./RequestFeatures.js";
import UrlFeatures from "./UrlFeatures.js";
import JsFeatures from "./JsFeatures.js";
import ResponseFeatures from "./ResponseFeatures.js";

var FeatureExtractor = (() => {

  let subClasses = [
    { label: "Request Details", obj: RequestFeatures },
    { label: "URL Features", obj: UrlFeatures },
    { label: "HTTP Header", obj: HeaderFeatures },
    { label: "HTTP Cookies", obj: CookieFeatures },
    { label: "HTTP Body", obj: BodyFeatures },
    { label: "JavaScript APIs", obj: JsFeatures },
    { label: "Response Details", obj: ResponseFeatures }
  ];

  let extractLengths = (array, keyOrValue) => 
    array.map((e) => 
      (e[keyOrValue] && e[keyOrValue].length) 
        ? e[keyOrValue].length 
        : 0
      );

  const features = subClasses
    .map((e) => e.obj)
    .reduce((acc, val) => 
      Object.assign(acc, val.features()), 
      {}
    );

  return {
    features: () => Object.keys(features),

    extract: (f, d) => features[f].impl(d),

    info: (f) => ({
      index: Object.keys(features).indexOf(f),
      title: features[f].title,
      subtitle: features[f].subtitle,
      lom: features[f].lom,
      cardinalityType: features[f].cardinalityType
    }),

    navigation: () => subClasses
      .map((c) => {
        let features = c.obj.features();
        return {
          label: c.label,
          featureGroup:
            Object.keys(features).map((k) => ({
              name: features[k].title,
              subtitle: features[k].subtitle,
              path: k
            }))
        };
      }).sort((a, b) =>
        a.label.localeCompare(b.label)
      ),

    encode: (e) => 
      (typeof e === "object") 
      ? e[0] + ": " + e[1] 
      : e,

    lengths: extractLengths,

  };
})();

export default FeatureExtractor;