var ChunksTmpStorage = function(msg) {
  let message = msg;

  return {
    get: () => message,
  };
};