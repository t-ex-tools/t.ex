import BlocklistsFeatures from "./features/BlocklistsFeatures.js";
import BodyFeatures from "./features/BodyFeatures.js";
import CookieFeatures from "./features/CookieFeatures.js";
import HeaderFeatures from "./features/HeaderFeatures.js";
import RequestFeatures from "./features/RequestFeatures.js";
import UrlFeatures from "./features/UrlFeatures.js";
import JsFeatures from "./features/JsFeatures.js";
import ResponseFeatures from "./features/ResponseFeatures.js";

var FeatureExtractor = (() => {

  let subClasses = [
    { label: "Request Details", obj: RequestFeatures },
    { label: "URL Features", obj: UrlFeatures },
    { label: "HTTP Header", obj: HeaderFeatures },
    { label: "HTTP Cookies", obj: CookieFeatures },
    { label: "HTTP Body", obj: BodyFeatures },
    { label: "JavaScript APIs", obj: JsFeatures },
    { label: "Response Details", obj: ResponseFeatures },
    { label: "Blocklists Details", obj: BlocklistsFeatures },
  ];

  let extractLengths = (array, keyOrValue) => 
    array.map((e) => e[keyOrValue].length);

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