export default {
  interfaces: (w) => [{
    interface: w.Document.prototype, 
    label: "Document",
    properties: ["cookie", "referrer"],
    methods: [],
  }, {
    interface: w/*indow*/, 
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
    interface: w.Navigator.prototype,
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
    interface: w.Geolocation.prototype,
    label: "Geolocation",
    properties: [],
    methods: [
      "getCurrentPosition", 
      "watchPosition", 
      "clearWatch",
    ],
  }, {
    interface: w.GeolocationCoordinates.prototype,
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
    interface: w.Screen.prototype,
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
    interface: w.Storage.prototype,
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
    interface: w.HTMLCanvasElement.prototype,
    label: "HTMLCanvasElement",
    properties: ["width", "height"],
    methods: [
      "getContext", 
      "toBlob", 
      "toDataURL"
    ],
  }, {
    interface: w.CanvasRenderingContext2D.prototype,
    label: "CanvasRenderingContext2D",
    properties: [],
    methods: [
      "createImageData", 
      "getImageData", 
      "putImageData",
    ],
  }, {
    interface: w.AnalyserNode.prototype,
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
    interface: w.AudioContext.prototype,
    label: "AudioContext",
    properties: [
      "baseLatency",
      "outputLatency",
    ],
    methods: [],
  }, {
    interface: w.BaseAudioContext.prototype,
    label: "BaseAudioContext",
    properties: [
      "currentTime",
      "sampleRate",
      "state",
    ],
    methods: [],
  }, {
    interface: w.OscillatorNode.prototype,
    label: "OscillatorNode",
    properties: [
      "frequency",
      "detune",
      "type",
    ],
    methods: [],
  }, {
    interface: w.AudioNode.prototype,
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
    interface: w.WebGLRenderingContext.prototype,
    label: "WebGLRenderingContext",
    properties: [],
    methods: ["getExtension"],
  }, {
    interface: w.Date.prototype,
    label: "Date",
    properties: [],
    methods: ["getTimezoneOffset"],
  }, {
    interface: w.MediaDevices.prototype,
    label: "MediaDevices",
    properties: [],
    methods: [
      "enumerateDevices",
      "getSupportedConstraints",
      "getDisplayMedia",
      "getUserMedia",
    ],
  }, {
    interface: w.BatteryManager.prototype,
    label: "BatteryManager",
    properties: [
      "charging",
      "chargingTime",
      "dischargingTime",
      "level",
    ],
    methods: [],
  }, {
    interface: w.NetworkInformation .prototype,
    label: "NetworkInformation ",
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