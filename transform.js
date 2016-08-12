const falafel = require('falafel')
const fs = require('fs')
const parallel = require('run-parallel')
const path = require('path')
const through = require('through2')

const cmz = require('./index.js')
const transformCss = require('./lib/transform-css')

const MOD_NAME = 'cmz'
const rootDir = process.cwd()

function createInsertCssCode (id, css) {
  return `
if (!global.__cmz_sheets) { global.__cmz_sheets = [] }
if (global.__cmz_sheets.indexOf('${id}') === -1) {
  require('insert-css')(${JSON.stringify(css)})
  global.__cmz_sheets.push('${id}')
}
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

module.exports = function transform (filename) {
  // css files require'd from previously transformed js files
  if (/.css$/.test(filename)) {
    return handleCssFile(filename)
  }

  // ignore non-js files
  if (!/\.js$/.test(filename)) { return through() }

  const bufs = []
  const cmzNodes = []
  const cmzInlineNodes = []
  let refName

  return through(write, end)

  // ----

  function write (buf, enc, next) {
    bufs.push(buf)
    next()
  }

  function end (done) {
    const src = Buffer.concat(bufs).toString('utf8')
    const ast = falafel(src, { ecmaVersion: 6 }, walk)
    const self = this

    parallel(cmzNodes.map(function (n) {
      return function (cb) {
        const args = n.arguments

        // if no arg was set, add one to the build so we can
        // figure out classnames at runtime
        if (args.length === 0) {
          const relFilename = filename.substr(rootDir.length + 1)
          const baseToken = cmz.tokenFromRelFilename(relFilename)
          const cssFile = filename.replace(/\.js$/, '.css')

          n.update(`cmz.createClassname.bind(null, '${baseToken}', {})
require('${cssFile}')
`)

          return cb()
        }
        // ----
        // 1 arg: manually specify the css module to load
        else if (args.length === 1) {
          const modFilename = args[0].value === '.' ? filename : path.resolve(path.dirname(filename), args[0].value)
          const relFilename = modFilename.substr(rootDir.length + 1)
          const baseToken = cmz.tokenFromRelFilename(relFilename)
          const cssFile = modFilename.replace(/\.js$/, '.css')
          const relCssFile = cssFile.substr(rootDir.length + 1)
          const css = fs.readFileSync(cssFile, 'utf8')

          const postcssOpts = {
            baseToken: baseToken,
            filename: cssFile
          }

          transformCss(css, postcssOpts, function (err, res) {
            if (err) { return cb(err) }

            n.update(`cmz.createClassname.bind(null, '${baseToken}', {})

${createInsertCssCode(relCssFile, res.css)}
`)
            cb()
          })
        }
        // ----
        // 2 args: manually specify the css module, and compositions
        else if (args.length === 2) {
          const modFilename = args[0].value === '.' ? filename : path.resolve(path.dirname(filename), args[0].value)
          const relFilename = modFilename.substr(rootDir.length + 1)
          const baseToken = cmz.tokenFromRelFilename(relFilename)
          const cssFile = modFilename.replace(/\.js$/, '.css')
          const relCssFile = cssFile.substr(rootDir.length + 1)
          const css = fs.readFileSync(cssFile, 'utf8')

          const postcssOpts = {
            baseToken: baseToken,
            filename: cssFile
          }

          transformCss(css, postcssOpts, function (err, res) {
            if (err) { return cb(err) }

            n.update(`cmz.createClassname.bind(null, '${baseToken}', ${args[1].source()})

${createInsertCssCode(relCssFile, res.css)}
`)
            cb()
          })
        }
      }
    }), function endParallel (err) {
      if (err) {
        return self.emit('error', err)
      }

      // process inline nodes
      parallel(cmzInlineNodes.map(function (n) {
        return function (cb) {
          const args = n.arguments

          const relFilename = filename.substr(rootDir.length + 1)
          const baseToken = cmz.tokenFromRelFilename(relFilename)
          const css = args[0].source().replace(/(^`|`$)/g, '').replace(/\$\{niceBlue\}/g, '@niceBlue')

          const postcssOpts = {
            baseToken: baseToken,
            filename: filename
          }

          transformCss(css, postcssOpts, function (err, res) {
            if (err) { return cb(err) }

            n.update(`cmz.createClassname.bind(null, '${baseToken}', {})

${createInsertCssCode(relFilename, res.css.replace(/@niceBlue/g, '${niceBlue}'))}
`)

            cb()
          })
        }
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

  function walk (node) {
    // find `require('cmz')` and record the name it's bound to
    if (node.type === 'CallExpression' &&
        node.callee && node.callee.name === 'require' &&
        node.arguments.length === 1 &&
        node.arguments[0].value === MOD_NAME) {
      refName = node.parent.id.name
      return
    }

    // find places where `cmz(...)` is called
    if (node.type === 'CallExpression' &&
        node.callee && node.callee.type === 'Identifier' &&
        node.callee.name === refName
       ) {
      // add the node to a list so we can replace it
      cmzNodes.push(node)
      return
    }

    // find places where `cmz.inline(...)` is called
    if (node.type === 'CallExpression' &&
        node.callee && node.callee.type === 'MemberExpression' &&
        node.callee.object.name === refName &&
        node.callee.property.name === 'inline') {
      cmzInlineNodes.push(node)
      return
    }
  }
}
