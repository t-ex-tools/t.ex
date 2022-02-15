module.exports = {
  publicPath: "/dist/",
  configureWebpack: (config) => {
    config.devtool = 'inline-source-map'
  },
}