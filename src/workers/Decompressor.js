import LZString from "../libraries/lz-string/lz-string.min.js";

self.addEventListener("message", (msg) => {
  if (msg.data.port && msg.data.data) {
    let chunks = msg.data.data.filter((chunk) => chunk);
    chunks.forEach((chunk, index) => {
      let pChunk = JSON.parse(LZString.decompressFromUTF16(chunk));
      self.postMessage({
        port: msg.data.port, 
        chunk: pChunk, 
        currentChunk: index+1, 
        numberOfChunks: chunks.length,
      });
    });
  }
});