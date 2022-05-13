var ValidationFeatures = (() => {

  const features = {
    "http.requestHeaders.debug.noHeaders": { 
      title: "No headers recorded", 
      subtitle: "No request headers recorded",
      impl: (r) => r.requestHeaders === undefined, 
      lom: 1,
      cardinalityType: 0,
    },
    "http.debug.noDetails": { 
      title: "No request", 
      subtitle: "No request details recorded",
      impl: (r) => r.url === undefined, 
      lom: 1,
      cardinalityType: 0,
    },
    "http.debug.noDetailsNoResponse": { 
      title: "No request / response", 
      subtitle: "No request and response details recorded",
      impl: (r) => 
        r.url === undefined && 
        r.response === undefined &&
        r.success,
      lom: 1,
      cardinalityType: 0,
    },
    "http.debug.success": { 
      title: "Successful request", 
      subtitle: "Whether the request was successful or not",
      impl: (r) => r.success, 
      lom: 1,
      cardinalityType: 0,
    },

    "http.response.debug.noResponse": { 
      title: "No response recorded", 
      subtitle: "No response details recorded",
      impl: (r) => r.response === undefined, 
      lom: 1,
      cardinalityType: 0,
    },    
  };

  return {
    features: () => features,
  };

})();

export default ValidationFeatures;