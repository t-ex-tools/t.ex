import Statistics from "./Statistics";

var Util = (() => {
  return {

    // https://stackoverflow.com/a/8084248
    // from doubletap's answer on Nov 10, 2011 at 18:12
    randomString: () =>
      (Math.random() + 1).toString(36).substring(2) +
      (Math.random() + 1).toString(36).substring(2),

    // https://gist.github.com/zensh/4975495
    // from zensh's gist created on 18 Feb 2013.
    memorySizeOf: function (obj) {
      var bytes = 0;

      function sizeOf(obj) {
        if (obj !== null && obj !== undefined) {
          switch (typeof obj) {
            case "number":
              bytes += 8;
              break;
            case "string":
              bytes += obj.length * 2;
              break;
            case "boolean":
              bytes += 4;
              break;
            case "object":
              var objClass = Object.prototype.toString.call(obj).slice(8, -1);
              if (objClass === "Object" || objClass === "Array") {
                for (var key in obj) {
                  if (!obj.hasOwnProperty(key)) continue;
                  sizeOf(obj[key]);
                }
              } else bytes += obj.toString().length * 2;
              break;
          }
        }
        return bytes;
      };

      return sizeOf(obj);
    },

    percent: function (dividend, divisor) {
      return ((dividend / divisor) * 100).toFixed(2)
    },

    options: function () {
      return [{
        label: "Display counts",
        slug: "counts",
        impl: (row, idx, rows) => row
      }, {
        label: "Display % of rows",
        slug: "percentage-of-rows",
        impl: (row, idx, rows) =>
          row
            .map((cell, i) => (i === 0)
              ? cell
              : Util.percent(cell, row[row.length - 1])
            )
      }, {
        label: "Display % of columns",
        slug: "percentage-of-columns",
        impl: (row, idx, rows) =>
          row
            .map((cell, i) => (i === 0)
              ? cell
              : Util.percent(cell, rows[rows.length - 1][i])
            )
      }, {
        label: "Display % of total",
        slug: "percentage-of-total",
        impl: (row, idx, rows) =>
          row
            .map((cell, i) => (i === 0)
              ? cell
              : Util.percent(cell, rows[rows.length - 1][row.length - 1])
            )
      }];
    },

    headings: function (query) {
      return ["Value"]
        .concat(
          query.members.map(
            (e) => e.label
          )
        )
        .concat(["#"]);
    },

    table: function (headings, data, feature, fn) {
      if (Object.keys(data).length === 0) {
        return;
      }

      let rows = Object.values(data)
        .map((e) => Object.keys(e[feature].all()))
        .reduce((acc, val) => [...new Set(acc.concat(val))], [])
        .map((e) => {
          let v = Object.values(data).map((el) =>
            el[feature].get(e) ? el[feature].get(e) : 0
          );
          return [e, ...v];
        });

      rows.forEach((row) => row.push(Statistics.sum(row.slice(1))));

      rows.push(
        headings.map((col, idx) =>
          idx === 0 ? "#" : Statistics.sum(rows.map((e) => e[idx]))
        )
      );

      rows = rows.map(fn);

      return rows;
    },

    csv: function (headings, table) {
      return [
        headings
      ].concat(table
      ).map((row) => {
        return row
          .map((h) => '"' + h.toString().replace(/"/g, '\\"') + '"')
          .join(",");
      }).join("\n");
    },

    download(payload, ext, tag, feature, slug, label) {
      browser.downloads.download({
        filename:
          tag.replaceAll("/", "-") +
          "/" +
          feature +
          "/" +
          feature +
          "." +
          slug +
          "-" +
          label +
          "." +
          ext,
        url: URL.createObjectURL(
          new Blob([payload], { type: "data:application/csv;charset=utf-8" })
        ),
      });
    },
  };
})();

export default Util;