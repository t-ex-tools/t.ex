import FeatureExtractor from "../FeatureExtractor.js";

var JsFeatures = (() => {

  let script = (url) => {
    try {   
      return FeatureExtractor.cache(url, () => new URL(url)).pathname;
    } catch (err) {
      return "";
    }
  };

  const features = {
    "js.interface": { 
      title: "Interface", 
      subtitle: "The JavaScript API used to access data.",
      impl: (js) => js.interface,
      lom: 1,
      cardinalityType: 0,
    },
    "js.property": { 
      title: "Property", 
      subtitle: "The property accessed or modified.",
      impl: (js) => js.property || "", 
      lom: 1,
      cardinalityType: 0,
    },
    "js.method": { 
      title: "JS Method", 
      subtitle: "The method called through the interface.",
      impl: (js) => js.method, 
      lom: 1,
      cardinalityType: 0,
    },
    "js.arguments": { 
      title: "Arguments", 
      subtitle: "The arguments passed to the method, which was called through the interface.",
      impl: (js) => (js.arguments) ? [...Object.entries(js.arguments)] : "", 
      lom: 1,
      cardinalityType: 0,
    },
    "js.result": { 
      title: "Result", 
      subtitle: "The result of the operation.",
      impl: (js) => (js.result) ? js.result.toString() : "", 
      lom: 1,
      cardinalityType: 0,
    },
    "js.script.url": { 
      title: "Script URL", 
      subtitle: "The script that initiated the operation.",
      impl: (js) => (js.stack[0]) ? script(js.stack[0]) : "", 
      lom: 1,
      cardinalityType: 0,
    },
    "js.stack": { 
      title: "Stack", 
      subtitle: "The call-stack of the property accessed or the method called through the interface.",
      impl: (js) => [...js.stack.entries()],
      lom: 1,
      cardinalityType: 0,
    },
    "js.url.hostname": { 
      title: "URL Hostname", 
      subtitle: "Hostname of the URL the operation occurred on.",
      impl: (js) => new URL(js.url).hostname, 
      lom: 1,
      cardinalityType: 0,
    },
  };

  return {
    features: () => features,
  };

})();

export default JsFeatures;