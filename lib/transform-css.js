const postcss = require('postcss')
const scopeClassnames = require('./scope-classnames')

module.exports = function (css, opts, cb) {
  const baseToken = opts.baseToken
  const filename = opts.filename

  // prefix all classnames with the base token
  postcss([scopeClassnames({ baseToken: baseToken })])
    .process(css, { from: filename, to: filename })
    .then((res) => {
      cb(null, res)
    })
    .catch(cb)
}
