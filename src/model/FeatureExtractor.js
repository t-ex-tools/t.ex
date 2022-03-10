/*
Level of measurements (lom): 
- Nominal level: 1
- Ordinal level: 2
- Interval level: 3
- Ratio level: 4
Cardinality type: (cardinalityType):
-> ONLY for lom < 3
- 0: single value like initiator
- 1: cardinality > 0 like query, requestHeaders, requestBody, and cookie
- 2: cardinality == n0 (cardinality of the natural numbers) or c (cardinality of the continuum)
*/

import BodyFeatures from "./features/BodyFeatures.js";
import CookieFeatures from "./features/CookieFeatures.js";
import HeaderFeatures from "./features/HeaderFeatures.js";
import RequestFeatures from "./features/RequestFeatures.js";
import UrlFeatures from "./features/UrlFeatures.js";
import JsFeatures from "./features/JsFeatures.js";
import ResponseFeatures from "./features/ResponseFeatures.js";

var FeatureExtractor = (() => {

  let cache = {};
  let subClasses = [
    { label: "Request features", obj: RequestFeatures },
    { label: "URL features", obj: UrlFeatures },
    { label: "HTTP Header", obj: HeaderFeatures },
    { label: "HTTP Cookies", obj: CookieFeatures },
    { label: "HTTP Body", obj: BodyFeatures },
    { label: "JavaScript features", obj: JsFeatures },
    { label: "Response features", obj: ResponseFeatures },
  ];

  // https://stackoverflow.com/a/8831937
  // from Mingwei Samuel's comment on Jul 13, 2020 at 8:58
  let hash = (str) => {
    return Array.from(str).reduce((hash, char) => 0 | (31 * hash + char.charCodeAt(0)), 0);
  }

  let fromCache = (key, f) => (key = hash(key),
    (cache[key]) ?
      cache[key] :
      (cache[key] = f(key), cache[key])
  );

  let extractLengths = (cacheKey, array, keyOrValue) => [...fromCache(cacheKey, () => array.map((e) => e[keyOrValue].length))];

  const features = subClasses
    .map((e) => e.obj)
    .reduce((acc, val) => Object.assign(acc, val.features()), {});

  return {
    features: () => Object.keys(features),
    extract: (f, d) => features[f].impl(d),
    extractAll: (r) => {
      return Object.entries(features).reduce((acc, value) => {
        acc[value[0]] = value[1].impl(r)
        return acc;
      }, {});
    },
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
              path: k
            }))
        };
      }).sort((a, b) =>
        a.label.localeCompare(b.label)
      ),
    encode: (e) => (typeof e === "object") ? e[0] + ": " + e[1] : e,
    cache: fromCache,
    lengths: extractLengths,
    hash: hash
  };
})();

export default FeatureExtractor;