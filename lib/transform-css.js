const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
const scopeClassnames = require('./scope-classnames')

module.exports = function (css, opts, cb) {
  const baseToken = opts.baseToken
  const filename = opts.filename

  // prefix all classnames with the base token
  const plugins = [
    scopeClassnames({ baseToken: baseToken }),
    autoprefixer
  ]
  postcss(plugins)
    .process(css, { from: filename, to: filename })
    .then((res) => {
      cb(null, res)
    })
    .catch(cb)
}
