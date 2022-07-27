import FeatureExtractor from "../features/FeatureExtractor.js";
import Data from "./Data.js";
import StatisticsTmpStorage from "./StatisticsTmpStorage.js";

var Statistics = (() => {
  let stats = {};

  return {
    count: (chunk, handler, info) => {
      if (chunk.length === 0) {
        handler(info)
      }

      chunk.forEach((d, i, array) => {
        let x = FeatureExtractor.extract(info.feature, d);

        if (typeof x === "object" && x.length > 0) {
          x.forEach((e, j, arr) => {
            let kv = FeatureExtractor.encode(e);
            stats[info.query][info.group][info.feature].put(kv);

            if (i === array.length - 1 &&
                j === arr.length - 1) {
                  handler(info);
              }
          });
        } else {
          stats[info.query][info.group][info.feature].put(x);

          if (i === array.length - 1) {
            handler(info);
          }
        }
      });
    },
    // NOTE: all features must be of same type
    query: function (type, queries, handler) {
      [...new Set(Object
        .values(queries)
        .flat()
      )].forEach((query) => {
        if (!stats[query.id]) {
          stats[query.id] = {};
          query.members
            .forEach((group, index) => {
              stats[query.id][index] = {};
            });
        }
      });

      let toCompute = { ...queries };
      Object
        .keys(queries)
        .forEach((feature) => {
          toCompute[feature] = queries[feature]
            .filter((query) => {
              if (stats[query.id][0][feature]) {
                Object.keys(stats[query.id])
                  .forEach((g, i) => {
                    handler({
                      feature: feature,
                      query: query.id,
                      group: i,
                      data: stats[query.id][i][feature],
                      loaded: 1,
                      total: 1
                    })
                  });
                return false;
              }
              return true;
            });

          if (toCompute[feature].length === 0) {
            delete toCompute[feature];
          }
        });

      if (Object.keys(toCompute).length === 0) {
        return;
      }

      Data.stream(type, (chunk, index, total) => {
        window.dispatchEvent(new CustomEvent("statistics:loading:update", {
          detail: {
            loaded: index,
            total: total
          }
        }));

        if (!chunk) {
          return;
        }

        Object
          .keys(toCompute)
          .forEach((feature) => {
            toCompute[feature]
              .forEach((query) => {
                query.members.forEach((g, i) => {

                  if (!stats[query.id][i][feature]) {
                    stats[query.id][i][feature] = new StatisticsTmpStorage();
                  }

                  let c = chunk.filter(g.filter);
                  let info = {
                    feature: feature,
                    query: query.id,
                    group: i,
                    data: stats[query.id][i][feature],
                    loaded: index,
                    total: total,
                  };
                  
                  this.count(c, handler, info);
                });
              })
          })
      });
      
    },
    sum: function (data) {
      return data.reduce((acc, val) => acc += val, 0);
    }
  };
})();

export default Statistics;