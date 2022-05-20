var JsFeatures = (() => {

  const features = {
    "js.interface": { 
      title: "Interface", 
      subtitle: "The JavaScript API used to access data",
      impl: (js) => js.interface,
      lom: 1,
      cardinalityType: 0,
    },
    "js.property": { 
      title: "Property", 
      subtitle: "The property accessed or modified",
      impl: (js) => js.property,
      lom: 1,
      cardinalityType: 0,
    },
    "js.method": { 
      title: "JS Method", 
      subtitle: "The method called through the interface",
      impl: (js) => js.method, 
      lom: 1,
      cardinalityType: 0,
    },
    "js.arguments": { 
      title: "Arguments", 
      subtitle: "Arguments passed to method, which was called",
      impl: (js) => (js.arguments) 
        ? [...Object.entries(js.arguments)] 
        : undefined,
      lom: 1,
      cardinalityType: 0,
    },
    "js.result": { 
      title: "Result", 
      subtitle: "The result the method returned",
      impl: (js) => (js.result) 
        ? js.result.toString() 
        : undefined, 
      lom: 1,
      cardinalityType: 0,
    },
    "js.script.url": { 
      title: "Script URL", 
      subtitle: "The script that initiated the operation",
      impl: (js) => js.url,
      lom: 1,
      cardinalityType: 0,
    },
    "js.url.hostname": { 
      title: "Source URL", 
      subtitle: "Hostname of the URL the operation occurred on",
      impl: (js) => js.source,
      lom: 1,
      cardinalityType: 0,
    },
    "js.tracker": { 
      title: "Tracker events", 
      subtitle: "True, if event matches one of the blocklists' rule",
      impl: (js) => js.labels.reduce((acc, val) => acc || val.isLabeled, false),
      lom: 1,
      cardinalityType: 0,
    },
  };

  return {
    features: () => features,
  };

})();

export default JsFeatures;