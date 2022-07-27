self.importScripts(
  "../js/labeler-core.var.js",
  "../js/lz-string.min.js",
  "./chunks/ChunksTmpStorage.js",
  "./chunks/ChunksHandler.js",
  "./chunks/ChunksPreprocessor.js",
  "./config/Blocklists.js",
);

let blocklists = [];
Blocklists
  .filter((l) => l.active)
  .forEach((e, i) => {
    blocklists[i] = new L.BlockList(e.name, e.url, e.evaluator)
  });

let queue = [];
let h = function(chunk, index, loaded, total) {
  self.postMessage({
    port: this.msg.data.port, 
    chunk: chunk,
    index: index,
    loaded: loaded,
    total: total
  });

  if (chunk) {
    if (queue.length > 0) {
      let next = queue.unshift().get();
      ChunksHandler.process(next, h.bind(this));
    }
  }
};

let handler = {
  "get": function(msg) {
    this.msg = msg;

    if (queue.length > 0) {
      queue.push(msg);
    } else {
      ChunksHandler.process(msg, h.bind(this));
    }
  },
  "lists": (msg) => {
    self.postMessage({
      port: msg.data.port, 
      lists: Blocklists
        .map((l) => {
          let x = { ...l };
          delete x.evaluator;
          return x;
        })
    });
  }
}

let route = (msg) => {
  if (!msg.data.hasOwnProperty("method")) {
    return;
  }

  switch (msg.data.method) {
    case "get":
      handler.get(msg);
      break;
    case "lists":
      handler.lists(msg);
      break;
    default:
      console.debug("Unknown message type");
  };
};

self.addEventListener("message", route);