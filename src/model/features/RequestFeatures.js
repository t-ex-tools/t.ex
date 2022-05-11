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
    "http.debug.noDetails": { 
      title: "DEBUG: No details recorded", 
      subtitle: "No request details recorded",
      impl: (r) => r.url === undefined, 
      lom: 1,
      cardinalityType: 0,
    },
    "http.debug.success": { 
      title: "DEBUG: Successful request", 
      subtitle: "Whether the request was successful or not",
      impl: (r) => r.success, 
      lom: 1,
      cardinalityType: 0,
    },    
  };

  return {
    features: () => features,
  };

})();

export default RequestFeatures;