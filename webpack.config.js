const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = (env) => {

  let config = {
    mode: "production",
    plugins: [
      new CopyPlugin({
        patterns: [{
            from: "node_modules/webextension-polyfill/dist/browser-polyfill.min.js",
            to: "js/browser-polyfill.min.js"
          }, {
            from: "node_modules/webextension-polyfill/dist/browser-polyfill.min.js.map",
            to: "js/browser-polyfill.min.js.map"
          }, {
            from: "node_modules/bootstrap-dark-5/dist/css/bootstrap-night.css",
            to: "css/bootstrap-night.css"
          }, {
            from: "node_modules/bootstrap-dark-5/dist/css/bootstrap-night.css.map",
            to: "css/bootstrap-night.css.map"
          }, {
            from: "node_modules/bootstrap-dark-5/dist/css/bootstrap.min.css",
            to: "css/bootstrap.mincss"
          }, {
            from: "node_modules/bootstrap-dark-5/dist/css/bootstrap.min.css.map",
            to: "css/bootstrap.min.css.map"
          }
        ],
      })
    ]
  };

  return config;

};