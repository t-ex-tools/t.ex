import FeatureExtractor from "./FeatureExtractor.js";
import Util from "./Util.js";

var Statistics = (() => {
  let source = null;
  let data = {};

  return {
    initialize: function(getData) {
      source = getData;
    },
    push: (chunk, feature, id, index, total) => {
      let keys = Object.keys(data);
      if (keys.length === 0) {
        return;
      }

      chunk.forEach((r, i) => {
        let x = FeatureExtractor.extract(feature)(r);
        (typeof x === "object") ?
          x.forEach((e) => {
            let kv = FeatureExtractor.encode(e);
            (data[id].data[feature][kv]) ? 
              data[id].data[feature][kv]++ 
              : data[id].data[feature][kv] = 1;
          })
          : (data[id].data[feature][x]) ?
            data[id].data[feature][x]++
            : data[id].data[feature][x] = 1;
        
        (i === chunk.length-1) ?
          window.dispatchEvent(new CustomEvent("statistics:update", {
            detail: {
              currentChunk: index,
              numberOfChunks: total
            }
          }))
          : null;
      });
    },
    query: function(filter, feature, id) {
      if (data[id] && data[id].data[feature]) {
        return {
          get: () => data[id],
        };
      }

      let result = {
        count: 0,
        query: filter,
        data: {}
      };
      result.data[feature] = {};
      data[id] = result;

      let dataSource = source(feature.split(".")[0]);
      Util.stream(dataSource, (chunk, index, total) => {
        let fChunk = chunk.filter(filter);
        result.count += fChunk.length; 
        this.push(fChunk, feature, id, index, total);
      });
      
      return {
        get: () => result,
      };
    },
    clear: function(id) {
      delete data[id];
    },
    total: function(data) {
      return data.reduce((acc, val) => acc += val, 0);
    },
    max: function(data) {
      return (data.length === 0) ? 
        0 
        : Math.max(...data);
    },
    min: function(data) {
      return (data.length === 0) ? 
        0 
        : Math.min(...data);
    },
    avg: function(data) {
      return (data.length === 0) ? 
        0 
        : Number.parseFloat((this.total(data) / data.length).toFixed(2));
    },
    median: function(data) {
      data.sort();
      return (data.length === 0) ? 0 :
        (data.length % 2 === 1) ? 
          data[Math.floor(data.length / 2)] 
          : (data[data.length / 2 - 1] + data[data.length / 2]) / 2;
    },
    q1: function(data) {
      return (data.length % 2 === 0) ? 
        this.median(data.slice(0, data.length / 2)) 
        : this.median(data.slice(0, data.length / 2 - 1));
    },
    q3: function(data) {
      return (data.length % 2 === 0) ? 
        this.median(data.slice(data.length / 2)) 
        : this.median(data.slice(data.length / 2 + 1));
    },
    iqr: function(data) {
      let q1 = this.q1(data);
      let q3 = this.q3(data);
      let w1 = q1 - 1.5 * (q3 - q1);
      let w2 = q3 + 1.5 * (q3 - q1);
      let min = this.min(data);
      let max = this.max(data);
      return [
        (w1 < min) ? min : w1,
        (w2 < max) ? w2 : max
      ];
    },
  };
})();

export default Statistics;