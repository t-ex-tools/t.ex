import FeatureExtractor from "./FeatureExtractor.js";
import Data from "./Data.js";
import StatisticsTmpStorage from "./StatisticsTmpStorage.js";

var Statistics = (() => {
  let stats = {};

  return {
    /*
     * @param {Array} c - Filtered chunk.
     * @param {String} feature - The identifier of the feature.
     * @param {String} id - The identifier of the query.
     * @param {Number} gi - The index of the group in the members array.
     * @param {Function} fn - The callback of the consuming component.
     */
    count: (c, feature, id, gi, fn) => {
      c.forEach((d, i, array) => {
        let x = FeatureExtractor.extract(feature, d);
        if (typeof x === "object") {
          x.forEach((e, j, arr) => {
            let kv = FeatureExtractor.encode(e);
            stats[id][gi].data[feature].put(kv);

            if (j === arr.length - 1) {
              fn(stats[id]);
            }
          });
        } else {
          stats[id][gi].data[feature].put(x);

          if (i === array.length - 1) {
            fn(stats[id]);
          }
        }
      });
    },
    // TODO: or queries, features -> callback with id
    query: function (type, query, feature, callback) {

      if (!stats[query.id]) {
        stats[query.id] = {};
      }

      // NOTE: In current implementation sufficient to check
      //       if feature was computed for 0-th group member.
      if (stats[query.id][0] &&
        stats[query.id][0].data &&
        stats[query.id][0].data[feature]) {
        callback(stats[query.id]);
        return;
      }

      Data.stream(type, (chunk, index, total) => {
        if (chunk) {
          query.members.forEach((g, i) => {
            let c = chunk.filter(g.filter);

            stats[query.id][i] = {
              data: {
                [feature]: new StatisticsTmpStorage()
              }

            }
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
    // TODO: queryAll maybe?
    sum: function (data) {
      return data.reduce((acc, val) => acc += val, 0);
    }
  };
})();

export default Statistics;