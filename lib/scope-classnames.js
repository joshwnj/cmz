const postcss = require('postcss')
const Tokenizer = require('css-selector-tokenizer')

module.exports = postcss.plugin('scopeClassnames', function (opts) {
  opts = opts || {}

  return function (css, result) {
    css.walkRules((rule) => {
      // const selector = Tokenizer.parse(rule.selector)
      // console.log('s', selector)
      rule.selector = rule.selector.replace(/^\./, `.${opts.baseToken}__`)
    })
  }
})
