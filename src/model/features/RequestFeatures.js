var RequestFeatures = (() => {

  const features = {
    "http.frameId": { 
      title: "Frame ID", 
      subtitle: "Associated frame ID of the request",
      impl: (r) => r.frameId, 
      lom: 4,
      cardinalityType: 2,
    },
    "http.initiator": { 
      title: "Initiator", 
      subtitle: "The URL of the request-initiating website",
      impl: (r) => r.initiator, 
      lom: 1,
      cardinalityType: 0,
    },
    "http.method": { 
      title: "Method", 
      subtitle: "The HTTP method of the request",
      impl: (r) => r.method, 
      lom: 1,
      cardinalityType: 0,
    },
    "http.type": { 
      title: "Type", 
      subtitle: "The type of the request",
      impl: (r) => r.type, 
      lom: 1,
      cardinalityType: 0,
    },
    "http.tracker": { 
      title: "Tracking requests", 
      subtitle: "True, if request matches one of the blocklists' rule",
      impl: (r) => r.labels.reduce((acc, val) => acc || val.isLabeled, false),
      lom: 1,
      cardinalityType: 0,
    },    
  };

  return {
    features: () => features,
  };

})();

export default RequestFeatures;