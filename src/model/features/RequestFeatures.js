var RequestFeatures = (() => {

  const features = {
    "requests.frameId": { 
      title: "Frame ID", 
      subtitle: "Associated frame ID the request was made within.",
      impl: (r) => r.frameId, 
      lom: 4,
      cardinalityType: 2,
    },
    "requests.initiator": { 
      title: "Initiator", 
      subtitle: "The URL of the initiator.",
      impl: (r) => r.initiator, 
      lom: 1,
      cardinalityType: 0,
    },
    "requests.method": { 
      title: "Method", 
      subtitle: "The HTTP method the request was issued with.",
      impl: (r) => r.method, 
      lom: 1,
      cardinalityType: 0,
    },
    "requests.type": { 
      title: "Type", 
      subtitle: "The type of the request.",
      impl: (r) => r.type, 
      lom: 1,
      cardinalityType: 0,
    },
  };

  return {
    features: () => features,
  };

})();

export default RequestFeatures;