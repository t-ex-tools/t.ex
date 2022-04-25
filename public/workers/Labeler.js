self.importScripts(
  "./lz-string.min.js",
  "../labeler-core/EasyListParser.js",
  "../labeler-core/EasyListEvaluator.js",
  "../labeler-core/DisconnectMeParser.js",
  "../labeler-core/DisconnectMeEvaluator.js",
  "../labeler-core/BlockList.js",
  "./ChunksTmpStorage.js",
  "./ChunksHandler.js",
  "./Blocklists.js",
);

let blocklists = [];
let queue = [];

Blocklists
  .filter((l) => l.active)
  .forEach((e) => {
    fetch(e.url)
      .then((response) => response.text())
      .then((rawList) => 
        blocklists.push(
          new BlockList(e.name, rawList, e.evaluator)
        )
      ).catch(() => {
        console.debug(e.name + " could not be loaded.");
        e.active = false;
      });
  });

self.addEventListener("message", (msg) => {

  if (!msg.data.hasOwnProperty("method")) {
    return;
  }

  let handler = (chunk, index, loaded) => {
    self.postMessage({
      port: msg.data.port, 
      chunk: chunk,
      index: index,
      loaded: loaded
    });

    if (chunk) {
      if (queue.length > 0) {
        let msg = queue.unshift().get();
        ChunksHandler.process(msg, handler);
      }
    }
  };

  switch (msg.data.method) {
    case "get":
      if (queue.length > 0) {
        queue.push(msg);
      } else {
        ChunksHandler.process(msg, handler);
      }
      break;
    case "lists":
      self.postMessage({
        port: msg.data.port, 
        lists: Blocklists
          .map((l) => {
            let x = { ...l };
            delete x.evaluator;
            return x;
          })
      });
      break;
    default:
      console.debug("Unknown message type");
  };
  
});