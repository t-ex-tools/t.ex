self.importScripts(
  "./lz-string.min.js",
  "../labeler-core/EasyListParser.js",
  "../labeler-core/EasyListEvaluator.js",
  "../labeler-core/DisconnectMeParser.js",
  "../labeler-core/DisconnectMeEvaluator.js",
  "../labeler-core/BlockList.js",
  "./ChunksHandler.js",
);

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

  if (!msg.data.hasOwnProperty("method")) {
    return;
  }

  switch (msg.data.method) {
    case "post":
      ChunksHandler.pass(msg.data.chunks);
      break;
    case "get":
      ChunksHandler.process(msg.data.type, msg.data.port, self);
      break;
    default:
      console.debug("Unknown message type");
  };
  
});