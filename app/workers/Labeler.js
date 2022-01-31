self.importScripts("../libraries/lz-string/lz-string.min.js");
self.importScripts("../model/labelers/DdgRadarParser.js");
self.importScripts("../model/labelers/DdgRadarEvaluator.js");
self.importScripts("../model/labelers/DisconnectMeParser.js");
self.importScripts("../model/labelers/DisconnectMeEvaluator.js");
self.importScripts("../model/labelers/EasyListParser.js");
self.importScripts("../model/labelers/EasyListEvaluator.js");
self.importScripts("../model/labelers/MyListParser.js");
self.importScripts("../model/labelers/MyListEvaluator.js");
self.importScripts("../model/BlockList.js");

const urls = [
  "https://easylist.to/easylist/easylist.txt",
  "https://easylist.to/easylist/easyprivacy.txt",
  // this.location.origin + "/app/resources/DdgRadarRules.json",
  "https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/services.json",
  this.location.origin + "/app/resources/MySimpleKeyWordRules.txt",
];

let blocklists = [
  new BlockList("EasyList", urls[0], EasyListEvaluator(EasyListParser)),
  new BlockList("EasyPrivacy", urls[1], EasyListEvaluator(EasyListParser)),
  // new BlockList("DuckDuckGo Tracker Rader", urls[2], DdgRadarEvaluator(DdgRadarParser)),
  new BlockList("Disconnect.me", urls[3], DisconnectMeEvaluator(DisconnectMeParser)),
  new BlockList("MyList", urls[4], MyListEvaluator(MyListParser)),
];

var isThirdParty = (r) => {
  try {
    let source = new URL(r.source);
    let target = new URL(r.url);
    return source.hostname !== target.hostname;
  } catch (err) {
    return false;
  }    
}

self.addEventListener("message", (msg) => {
  if (msg.data.port && msg.data.data) {
    let chunks = msg.data.data.filter((chunk) => chunk);
    let numRequests = [];
    chunks.forEach((chunk, index) => {
      let pChunk = JSON.parse(LZString.decompressFromUTF16(chunk));
      (index === 0) ?
        numRequests = new Array(chunks.length).fill(pChunk.length)
        : numRequests[index] = pChunk.length;
      pChunk.forEach((request, i) => {
        request.labels = blocklists.map((e) => e.isLabeled(request));
        self.postMessage({
          port: msg.data.port, 
          chunk: (i === pChunk.length-1) ? pChunk : null,
          currentChunk: numRequests.slice(0, index).reduce((acc, val) => acc + val, 0) + i+1,
          numberOfChunks: numRequests.reduce((acc, val) => acc + val, 0),
        });        
      });
    })
  }
});