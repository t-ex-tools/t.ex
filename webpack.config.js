const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {

  let config = {
    entry: "./index.js",
    mode: "production",
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      new CopyPlugin({
        patterns: [{
          from: "t.ex-tension/dist"
        }, {
          from: "labeler-core/dist/labeler-core.var.js", 
          to: "js/"
        }, {
          from: "t.ex-gui/dist"
        }],
      })
    ]
  };

  return config;

};