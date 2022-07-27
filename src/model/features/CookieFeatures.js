import FeatureExtractor from "./FeatureExtractor.js";
import HeaderFeatures from "./HeaderFeatures.js"
import ResponseFeatures from "./ResponseFeatures.js";
import Statistics from "../data/Statistics.js";

var CookieFeatures = (() => {

  let cookie = (r) =>  {
    let header = HeaderFeatures.header(r);
    let c = HeaderFeatures.get(header, "cookie");
    
    return (c) 
      ? c.split(";").map((el) => el.trim().split("="))
      : [];
  };
  
  let lengths = (r, i) => {
    let c = cookie(r);
    return FeatureExtractor.lengths(c, i);
  };

  const features = {
    "http.requestHeaders.cookies.present": {
      title: "Cookie presence",
      subtitle: "Whether request contained a cookie",
      impl: (r) => cookie(r).length > 0,
      lom: 1,
      cardinalityType: 1,
    },
    "http.requestHeaders.cookies.set": {
      title: "Set-Cookie present in response",
      subtitle: "Whether response contained a set-cookie field",
      impl: (r) => HeaderFeatures.get(ResponseFeatures.header(r), "set-cookie") !== undefined,
      lom: 1,
      cardinalityType: 1,
    },
    "http.requestHeaders.cookies.fields": {
      title: "Cookie",
      subtitle: "Key-value pairs contained in the cookie",
      impl: (r) => cookie(r),
      lom: 1,
      cardinalityType: 1,
    },
    "http.requestHeaders.cookies.keys": {
      title: "Cookie keys",
      subtitle: "Keys contained in the cookie",
      impl: (r) => cookie(r).map((e) => e[0]),
      lom: 1,
      cardinalityType: 1,
    },
    "http.requestHeaders.cookies.values": {
      title: "Cookie values",
      subtitle: "Values contained in the cookie",
      impl: (r) => cookie(r).map((e) => e[1]),
      lom: 1,
      cardinalityType: 1,
    },
    "http.requestHeaders.cookies.nkvp": {
      title: "Cookie fields",
      subtitle: "Number of key-value pairs in the cookie",
      impl: (r) => cookie(r).length,
      lom: 4,
      cardinalityType: 2,
    },
    "http.requestHeaders.cookies.keyLength.total": {
      title: "Key length",
      subtitle: "Total length of cookie keys",
      impl: (r) => Statistics.sum(lengths(r, 0)),
      lom: 4,
      cardinalityType: 2,
    },
    "http.requestHeaders.cookies.valueLength.total": {
      title: "Value length",
      subtitle: "Total length of cookie values",
      impl: (r) => Statistics.sum(lengths(r, 1)),
      lom: 4,
      cardinalityType: 2,
    },
  };

  return {
    features: () => features,
  };

})();

export default CookieFeatures;