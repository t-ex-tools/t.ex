const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {

  env.mode = (env.mode) ? env.mode : "development";

  let config = {
    entry: "./index.js",
    mode: env.mode,
    devtool: 'inline-source-map',
    optimization: {
      minimize: (env.mode === "production")
    },
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