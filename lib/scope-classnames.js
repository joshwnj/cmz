'use strict'

// based on https://github.com/css-modules/postcss-modules-local-by-default/blob/master/index.js
const postcss = require('postcss')
const Tokenizer = require('css-selector-tokenizer')

module.exports = postcss.plugin('scopeClassnames', function (opts) {
  opts = opts || {}

  const scopedNames = {}

  function localizeRule (rule) {
    const selector = Tokenizer.parse(rule.selector)
    let scopedSelector

    try {
      scopedSelector = localizeNode(selector)
    } catch (e) {
      throw rule.error(e.message)
    }

    rule.selector = Tokenizer.stringify(scopedSelector)
  }

  function localizeNode (node) {
    switch (node.type) {
      case 'selectors':
        node.nodes = node.nodes.map(localizeNode)
        break

      case 'selector':
        node.nodes = node.nodes.map(localizeNode)
        break

      case 'nested-pseudo-class':
        node.nodes = node.nodes.map(localizeNode)
        break

      case 'class':
        node.name = scopedNames[node.name] = `${opts.baseToken}__${node.name}`
        break

      case 'invalid':
        if (node.value === '&') {
          return {
            type: 'class',
            name: opts.baseToken
          }
        }
    }

    return node
  }

  return function (css, result) {
    css.walkRules(localizeRule)
    result.scopedNames = scopedNames
  }
})
