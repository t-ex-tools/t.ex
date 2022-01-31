import FeatureExtractor from "../FeatureExtractor.js";
import HeaderFeatures from "./HeaderFeatures.js"
import Statistics from "../Statistics.js";

var CookieFeatures = (() => {

  let cookie = (r) => (r.requestHeaders) ?
    FeatureExtractor.cache(JSON.stringify(r.requestHeaders),
      () => {
        let f = HeaderFeatures.extractHeader(r).find((e) => e[0].toLowerCase() === "cookie");
        return ((f) ? f[1].split(";").map((el) => el.split("=")) : []);
      })
    : [];
  let kLengths = (r) => FeatureExtractor.lengths("cookie.keyLengths@" + JSON.stringify(r.requestHeaders), cookie(r), 0);
  let vLengths = (r) => FeatureExtractor.lengths("cookie.valueLengths@" + JSON.stringify(r.requestHeaders), cookie(r), 1);

  const features = {
    "requests.requestHeaders.cookies.present": {
      title: "Cookie present",
      subtitle: "Request contained a cookie or not.",
      impl: (r) => cookie(r).length > 0,
      lom: 1,
      cardinalityType: 1,
    },
    "requests.requestHeaders.cookies": {
      title: "Cookie",
      subtitle: "Key value-pairs contained in the cookie.",
      impl: (r) => cookie(r),
      lom: 1,
      cardinalityType: 1,
    },
    "requests.requestHeaders.cookies.keys": {
      title: "Cookie Keys",
      subtitle: "Key value-pairs contained in the cookie.",
      impl: (r) => cookie(r).map((e) => e[0]),
      lom: 1,
      cardinalityType: 1,
    },
    "requests.requestHeaders.cookies.values": {
      title: "Cookie Values",
      subtitle: "Key value-pairs contained in the cookie.",
      impl: (r) => cookie(r).map((e) => e[1]),
      lom: 1,
      cardinalityType: 1,
    },
    "requests.requestHeaders.cookies.nkvp": {
      title: "Number of cookie fields.",
      subtitle: "Number of key-value pairs in the cookie.",
      impl: (r) => cookie(r).length,
      lom: 4,
      cardinalityType: 2,
    },
    "requests.requestHeaders.cookies.keyLength.total": {
      title: "CK | Lengths of keys",
      subtitle: "Total lengths of cookie's keys.",
      impl: (r) => Statistics.total(kLengths(r)),
      lom: 4,
      cardinalityType: 2,
    },
    "requests.requestHeaders.cookies.valueLength.total": {
      title: "CK | Lengths of values",
      subtitle: "Total lengths of cookie's values.",
      impl: (r) => Statistics.total(vLengths(r)),
      lom: 4,
      cardinalityType: 2,
    },
  };

  return {
    features: () => features,
  };

})();

export default CookieFeatures;