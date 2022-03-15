import LZString from "../js/lz-string.min.js";

import EasyListParser from "../labeler-core/EasyListParser.js";
import EasyListEvaluator from "../labeler-core/EasyListEvaluator.js";
import DisconnectMeParser from "../labeler-core/DisconnectMeParser.js";
import DisconnectMeEvaluator from "../labeler-core/DisconnectMeEvaluator.js";
import BlockList from "../labeler-core/BlockList.js";

let cache = {};
let blocklists = [];

[{
  name: "EasyList",
  url: "https://easylist.to/easylist/easylist.txt",
  evaluator: EasyListEvaluator(EasyListParser)
}, {
  name: "EasyPrivacy",
  url: "https://easylist.to/easylist/easyprivacy.txt",
  evaluator: EasyListEvaluator(EasyListParser)
}, {
  name: "Disconnect.me",
  url: "https://raw.githubusercontent.com/disconnectme/disconnect-tracking-protection/master/services.json",
  evaluator: DisconnectMeEvaluator(DisconnectMeParser)
}].forEach((e) => {
  fetch(e.url)
    .then((response) => response.text())
    .then((rawList) => blocklists.push(new BlockList(e.name, rawList, e.evaluator)));
});

self.addEventListener("message", (msg) => {

  if (!msg.data.port || 
      !msg.data.chunks ||
      !msg.data.type) {
        return;
  }

  let n = [];
  msg.data.chunks
    .forEach((chunk, index) => {

      if (cache[msg.data.type] && 
          cache[msg.data.type][index]) {
      
        self.postMessage({
          port: msg.data.port, 
          chunk: cache[msg.data.type][index],
          loaded: cache[msg.data.type][index].length,
          total: cache[msg.data.type][index].length,
        });

      } else {
        let d = JSON.parse(LZString.decompressFromUTF16(chunk));

        if (index === 0) {
          n = new Array(msg.data.chunks.length).fill(d.length)
        } else {
          n[index] = d.length;
        }
        
        d.forEach((r, i) => {
          if (r === null) {
            return;
          }

          r.labels = blocklists.map((e) => e.isLabeled(r));
          
          // TODO: caching can cause OutOfMemory
          if (i === d.length-1) {
            if (!cache[msg.data.type]) {
              cache[msg.data.type] = [];
            }
            cache[msg.data.type][index] = d;
          }
  
          self.postMessage({
            port: msg.data.port,
            chunk: (i === d.length-1) ? d : null,
            loaded: n.slice(0, index).reduce((acc, val) => acc + val, 0) + i+1,
            total: n.reduce((acc, val) => acc + val, 0),
          });
        });

      }
    });
});