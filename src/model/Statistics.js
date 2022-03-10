import FeatureExtractor from "./FeatureExtractor.js";
import Util from "./Util.js";

var Statistics = (() => {
  let stats = {};

  return {
    count: (c, feature, id, gi, fn) => {
      c.forEach((d, i, array) => {
        let x = FeatureExtractor.extract(feature, d);
        if (typeof x === "object") {
          x.forEach((e, j, arr) => {
            let kv = FeatureExtractor.encode(e);
            (stats[id][gi].data[feature][kv])
              ? stats[id][gi].data[feature][kv]++
              : stats[id][gi].data[feature][kv] = 1;

            if (j === arr.length - 1) {
              fn(stats[id]);
            }
          });
        } else {
          (stats[id][gi].data[feature][x])
            ? stats[id][gi].data[feature][x]++
            : stats[id][gi].data[feature][x] = 1;

          if (i === array.length - 1) {
            fn(stats[id]);
          }
        }
      });
    },
    query: function (data, query, feature, callback) {

      stats[query.id] = {};

      Util.labeledStream(data, (chunk, index, total) => {
        if (chunk) {
          query.members.forEach((g, i, arr) => {
            let c = chunk.filter(g.filter);
            if (!stats[query.id][i]) {
              stats[query.id][i] = { count: 0, data: { [feature]: {} } };
            }
            stats[query.id][i].count += c.length;
            this.count(c, feature, query.id, i, callback);
          });
        }

        window.dispatchEvent(new CustomEvent("statistics:loading:update", {
          detail: {
            loaded: index,
            total: total
          }
        }));
      });
    },
    total: function(data) {
      return data.reduce((acc, val) => acc += val, 0);
    }
  };
})();

export default Statistics;