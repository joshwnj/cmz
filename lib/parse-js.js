'use strict'

const falafel = require('falafel')
const MOD_NAME = 'cmz'

module.exports = function parseJs (src) {
  let refName
  const nodes = {
    normal: [],
    inline: []
  }

  const ast = falafel(src, { ecmaVersion: 6 }, function walk (node) {
    if (node.type !== 'CallExpression') { return }
    if (!node.callee) { return }

    // find `require('cmz')` and record the name it's bound to
    if (node.callee.name === 'require' &&
        node.arguments.length === 1 &&
        node.arguments[0].value === MOD_NAME) {
      refName = node.parent.id.name
      return
    }

    // find places where `cmz(...)` is called
    if (node.callee.type === 'Identifier' &&
        node.callee.name === refName
       ) {
      // add the node to a list so we can replace it
      nodes.normal.push(node)
      return
    }

    // find places where `cmz.inline(...)` is called
    if (node.callee.type === 'MemberExpression' &&
        node.callee.object.name === refName &&
        node.callee.property.name === 'inline') {
      // add the node to a list so we can replace it
      nodes.inline.push(node)
      return
    }
  })

  return {
    ast: ast,
    nodes: nodes
  }
}
