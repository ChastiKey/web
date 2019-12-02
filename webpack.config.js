const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

exports.plugins.push(new VuetifyLoaderPlugin())
exports.module.rules.push({
  test: /\.less$/,
  use: ['vue-style-loader', 'css-loader', 'less-loader']
})
