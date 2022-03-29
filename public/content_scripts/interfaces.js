export default {
  interfaces: () => [{
    label: "Document",
    properties: ["cookie", "referrer"],
    methods: [],
  }, {
    label: "window",
    properties: [
      "name", 
      "innerHeight", 
      "innerWidth", 
      "outerHeight", 
      "outerWidth",   
      /*
      "pageXOffset", 
      "pageYOffset", 
      "screenLeft", 
      "screenTop", 
      "screenX", 
      "screenY", 
      "scrollX", 
      "scrollY"
      */
    ],
    methods: [],  
  }, {
    label: "Navigator",
    properties: [
      "appCodeName", 
      "appName", 
      "appVersion", 
      "cookieEnabled",
      "doNotTrack",
      "language", 
      "languages",
      "mimeTypes", 
      "onLine", 
      "oscpu",
      "platform", 
      "product",
      "productSub",
      "userAgent",
      "deviceMemory",
      "hardwareConcurrency",
      "maxTouchPoints",
      "vendor",
      "vendorSub",
      "webdriver",
    ],
    methods: ["javaEnabled"],
  }, {
    label: "Geolocation",
    properties: [],
    methods: [
      "getCurrentPosition", 
      "watchPosition", 
      "clearWatch",
    ],
  }, {
    label: "GeolocationCoordinates",
    properties: [
      "latitude",
      "longitude",
      "altitude",
      "accuracy",
      "altitudeAccuracy",
      "heading",
      "speed",
    ],
    methods: [],
  }, {    
    label: "Screen",
    properties: [
      "availHeight", 
      "availWidth", 
      "colorDepth", 
      "height", 
      "pixelDepth", 
      "width",
    ],
    methods: [],
  }, {  
    label: "Storage",
    properties: ["length"],
    methods: [
      "key", 
      "getItem", 
      "setItem",
      "removeItem",
      "clear",
    ],
  }, {
    label: "HTMLCanvasElement",
    properties: ["width", "height"],
    methods: [
      "getContext", 
      "toBlob", 
      "toDataURL"
    ],
  }, {
    label: "CanvasRenderingContext2D",
    properties: [],
    methods: [
      "createImageData", 
      "getImageData", 
      "putImageData",
    ],
  }, {
    label: "AnalyserNode",
    properties: [
      "fftSize",
      "frequencyBinCount",
      "minDecibels",
      "maxDecibels",
      "smoothingTimeConstant",

    ],
    methods: [],
  }, {
    label: "AudioContext",
    properties: [
      "baseLatency",
      "outputLatency",
    ],
    methods: [],
  }, {
    label: "BaseAudioContext",
    properties: [
      "currentTime",
      "sampleRate",
      "state",
    ],
    methods: [],
  }, {
    label: "OscillatorNode",
    properties: [
      "frequency",
      "detune",
      "type",
    ],
    methods: [],
  }, {
    label: "AudioNode",
    properties: [
      "context",
      "numberOfInputs",
      "numberOfOutputs",
      "channelCount",
      "channelCountMode",
      "channelInterpretation",
    ],
    methods: [],
  }, {
    label: "WebGLRenderingContext",
    properties: [],
    methods: ["getExtension"],
  }, {
    label: "Date",
    properties: [],
    methods: ["getTimezoneOffset"],
  }, {
    label: "MediaDevices",
    properties: [],
    methods: [
      "enumerateDevices",
      "getSupportedConstraints",
      "getDisplayMedia",
      "getUserMedia",
    ],
  }, {
    label: "BatteryManager",
    properties: [
      "charging",
      "chargingTime",
      "dischargingTime",
      "level",
    ],
    methods: [],
  }, {
    label: "NetworkInformation",
    properties: [
      "downlink",
      "downlinkMax",
      "effectiveType",
      "rtt",
      "saveData",
      "type",
    ],
    methods: [],
  }],
  elementMethods: [
    "createElement",
    "createElementNS",
    "getElementById",
    "getElementsByName",
    "getElementsByClassName",
    "getElementsByTagName",
    "getElementsByTagNameNS"
  ],
};