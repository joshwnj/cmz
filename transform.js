'use strict'

const parallel = require('run-parallel')
const path = require('path')
const through = require('through2')

const cmz = require('./index.js')
const parseJs = require('./lib/parse-js')
const transformCss = require('./lib/transform-css')

const rootDir = process.cwd()

function createInsertCssCode (id, css, scopedNames) {
  return `
require('cmz').upsertCss('${id}', \`${css}\`)
module.exports = ${JSON.stringify(scopedNames)}
`
}

function handleCssFile (filename) {
  const bufs = []

  return through(function (buf, enc, next) {
    bufs.push(buf)
    next()
  }, function (done) {
    const self = this

    const css = Buffer.concat(bufs).toString('utf8')
    const relFilename = filename.substr(rootDir.length + 1)

    const postcssOpts = {
      baseToken: cmz.tokenFromRelFilename(relFilename),
      filename: filename
    }

    transformCss(css, postcssOpts, function (err, res) {
      if (err) {
        self.emit('error', err)
        return done()
      }

      self.push(createInsertCssCode(relFilename, res.css, res.scopedNames))
      self.push(null)
      done()
    })
  })
}

function handleNormalNode (filename, n, cb) {
  const args = n.arguments

  const filenameArg = args.length > 0 ? args[0].value : '.'
  const modFilename = filenameArg === '.'
        ? filename
        : path.resolve(path.dirname(filename), filenameArg)

  const relFilename = modFilename.substr(rootDir.length + 1)
  const baseToken = cmz.tokenFromRelFilename(relFilename)
  const cssFile = modFilename.replace(/\.js$/, '.css')

  n.update(`(function () {
  var tokens = require('${cssFile}')
  return tokens
}())`)

  return cb()
}

function prepareCssTemplate (tl) {
  const subs = []
  const result = tl.quasis.map(function (q) {
    let part = q.value.raw

    if (!q.tail) {
      const i = subs.length
      part += `@sub_${i}`
      subs.push(tl.expressions[i].source())
    }

    return part
  }).join('')

  return {
    subs: subs,
    result: result
  }
}

function prepareCssString (node) {
  const subs = []
  const result = []

  function visit (node) {
    if (node.type === 'Literal') {
      result.push(node.value)
      return
    }

    if (node.type === 'Identifier') {
      result.push(`@sub_${subs.length}`)
      subs.push(node.name)
      return
    }

    if (node.type === 'BinaryExpression') {
      visit(node.left)
      visit(node.right)
      return
    }

    console.error('Unexpected node:', node)
  }

  visit(node)

  return {
    subs: subs,
    result: result.join('')
  }
}

function prepareCss (tl) {
  return tl.quasis
    ? prepareCssTemplate(tl)
    : prepareCssString(tl)
}

function handleInlineNode (filename, n, cb) {
  const args = n.arguments

  const rootName = args[0].source().replace(/["'`]/g, '')
  const relFilename = filename.substr(rootDir.length + 1)
  const baseToken = `${cmz.tokenFromRelFilename(relFilename)}_${rootName}`

  // substitute out any js blocks so they don't interfere with postcss
  const tl = args[1]
  const prepared = prepareCss(tl)
  const css = prepared.result
  const subs = prepared.subs

  const postcssOpts = {
    baseToken: baseToken,
    filename: filename
  }

  transformCss(css, postcssOpts, function (err, res) {
    if (err) { return cb(err) }

    // substitute the js blocks back in
    const css = res.css.replace(/@sub_(\d+)/g, function (match, i) {
      return '${' + subs[i] + '}'
    })

    const line = n.loc.start.line
    const id = `${relFilename}:${line}`

    n.update(`(function () {
  ${createInsertCssCode(id, css, res.scopedNames)}
  return ${JSON.stringify(res.scopedNames)}
}())`)

    cb()
  })
}

module.exports = function transform (filename) {
  // css files require'd from previously transformed js files
  if (/.css$/.test(filename)) { return handleCssFile(filename) }

  // ignore non-js files
  if (!/\.js$/.test(filename)) { return through() }

  const bufs = []
  return through(write, end)

  // ----

  function write (buf, enc, next) {
    bufs.push(buf)
    next()
  }

  function end (done) {
    const src = Buffer.concat(bufs).toString('utf8')
    const parseInfo = parseJs(src)
    const ast = parseInfo.ast
    const self = this

    function createHandlers (nodes, handler) {
      return nodes.map(function (n) {
        return handler.bind(null, filename, n)
      })
    }

    const funcs = []
          .concat(createHandlers(parseInfo.nodes.normal, handleNormalNode))
          .concat(createHandlers(parseInfo.nodes.inline, handleInlineNode))
          .filter(Boolean)

    parallel(funcs, function (err) {
      if (err) {
        self.emit('error', err)
        return done()
      }

      self.push(ast.toString())
      self.push(null)
      done()
    })
  }
}
