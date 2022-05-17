self.importScripts(
  "./lib/lz-string.min.js",
  "../labeler-core/dist/labeler-core.var.js",
  "./chunks/ChunksTmpStorage.js",
  "./chunks/ChunksHandler.js",
  "./chunks/ChunksPreprocessor.js",
  "./config/Blocklists.js",
);

const L = Labeler.default;

// TODO: temporary solution
let tmpMap = [
  L.EasyListEvaluator(L.EasyListParser),
  L.EasyListEvaluator(L.EasyListParser),
  L.DisconnectMeEvaluator(L.DisconnectMeParser)
];

let blocklists = [];
Blocklists
  .filter((l) => l.active)
  .map((l, i) => (l.evaluator = tmpMap[i], l))
  .forEach((e, i) => {
    fetch(e.url)
      .then((response) => response.text())
      .then((rawList) => 
        blocklists[i] = new L.BlockList(e.name, rawList, e.evaluator)
      ).catch(() => {
        console.debug(e.name + " could not be loaded.");
        e.active = false;
      });
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