self.importScripts("../libraries/lz-string/lz-string.min.js");

import EasyListParser from "../model/labeler-core/EasyListParser.js";
import EasyListEvaluator from "../model/labeler-core/EasyListEvaluator.js";
import DisconnectMeParser from "../model/labeler-core/DisconnectMeParser.js";
import DisconnectMeEvaluator from "../model/labeler-core/DisconnectMeEvaluator.js";
import BlockList from "../model/BlockList.js";

let blocklists = [{
  name: "EasyList",
  url: "https://easylist.to/easylist/easylist.txt",
  evaluator: EasyListEvaluator(EasyListParser)
}, {
  name: "EasyPrivacy",
  url: "https://easylist.to/easylist/easyprivacy.txt",
  evaluator: EasyListEvaluator(EasyListParser)
},{
  name: "Disconnect.me",
  url: "https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/services.json",
  evaluator: DisconnectMeEvaluator(DisconnectMeParser)
},{
  name: "EasyList",
  url: "https://easylist.to/easylist/easylist.txt",
  evaluator: EasyListEvaluator(EasyListParser)
}].map((e) => new BlockList(e.name, e.url, e.evaluator));

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