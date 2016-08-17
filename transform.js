const fs = require('fs')
const parallel = require('run-parallel')
const path = require('path')
const through = require('through2')

const cmz = require('./index.js')
const parseJs = require('./lib/parse-js')
const transformCss = require('./lib/transform-css')

const rootDir = process.cwd()

function createInsertCssCode (id, css) {
  return `
require('cmz').upsertCss('${id}', \`${css}\`)
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

      self.push(createInsertCssCode(relFilename, res.css))
      self.push(null)
      done()
    })
  })
}

function handleNormalNode (filename, n, cb) {
  const args = n.arguments

  const comps = args.length > 1 ? args[1].source() : '{}'
  const filenameArg = args.length > 0 ? args[0].value : '.'
  const modFilename = filenameArg === '.' ?
        filename :
        path.resolve(path.dirname(filename), filenameArg)

  const relFilename = modFilename.substr(rootDir.length + 1)
  const baseToken = cmz.tokenFromRelFilename(relFilename)
  const cssFile = modFilename.replace(/\.js$/, '.css')

  n.update(`cmz.createClassname.bind(null, '${baseToken}', ${comps})
require('${cssFile}')
`)

  return cb()
}

function handleInlineNode (filename, n, cb) {
  const args = n.arguments

  const comps = args.length > 1 ? args[1].source() : '{}'
  const relFilename = filename.substr(rootDir.length + 1)
  const baseToken = cmz.tokenFromRelFilename(relFilename)

  // substitute out any js blocks so they don't interfere with postcss
  const subs = []
  const css = args[0].source()
        .replace(/(^`|`$)/g, '')
        .replace(/\$\{.*?\}/g, function (matches) {
          const i = subs.length
          subs.push(matches)
          return `@sub_${i}`
        })

  const postcssOpts = {
    baseToken: baseToken,
    filename: filename
  }

  transformCss(css, postcssOpts, function (err, res) {
    if (err) { return cb(err) }

    // substitute the js blocks back in
    const css = res.css.replace(/\@sub_(\d+)/g, function (match, i) {
      return subs[i]
    })

    const line = n.loc.start.line
    const id = `${relFilename}:${line}`
    n.update(`cmz.createClassname.bind(null, '${baseToken}', ${comps})
${createInsertCssCode(id, css)}
`)

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

    parallel(parseInfo.nodes.normal.map(function (n) {
      return handleNormalNode.bind(null, filename, n)
    }), function endParallel (err) {
      if (err) {
        return self.emit('error', err)
      }

      // process inline nodes
      parallel(parseInfo.nodes.inline.map(function (n) {
        return handleInlineNode.bind(null, filename, n)
      }), function endParallel (err) {
        if (err) {
          self.emit('error', err)
          return done()
        }

        self.push(ast.toString())
        self.push(null)
        done()
      })
    })
  }
}
