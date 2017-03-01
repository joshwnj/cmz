'use strict'

const browser = require('./browser')
const fs = require('fs')
const path = require('path')
const caller = require('caller')
const transformCss = require('./lib/transform-css')

let rootDir = process.cwd()

function cmz (filename) {
  const absFilename = getAbsFilename(filename, caller())
  const relFilename = relativeToRoot(absFilename)

  const raw = fs.readFileSync(absFilename, 'utf8')
  return transform(raw, {
    baseToken: tokenFromRelFilename(relFilename),
    filename: absFilename
  })
}

function inline (rootName, raw) {
  const absFilename = caller()
  const relFilename = relativeToRoot(absFilename)
  const baseToken = tokenFromRelFilename(relFilename) + '_' + rootName

  return transform(raw, {
    baseToken: baseToken,
    filename: absFilename
  })
}

function transform (raw, opts) {
  const lazyResult = transformCss.sync(raw, opts)
  const css = lazyResult.css
  const scopedNames = lazyResult.result.scopedNames

  const result = Object.assign({}, scopedNames, {
    '@css': css
  })

  return result
}

function tokenFromRelFilename (relFilename) {
  return relFilename.replace(/[\/\\]/g, '_').replace(/\.(.*?)$/, '')
}

function relativeToRoot (filename) {
  return filename.substr(rootDir.length + 1)
}

function getAbsFilename (filename, callerFile) {
  if (typeof filename !== 'string' || filename === '.') {
    filename = callerFile.replace(/\.js$/, '.css')
  }

  const callerDir = path.dirname(callerFile)
  return path.resolve(callerDir, filename)
}

module.exports = cmz
module.exports.inline = inline
module.exports.transform = transform
module.exports.compose = browser.compose
module.exports.tokenFromRelFilename = tokenFromRelFilename
module.exports.getAbsFilename = getAbsFilename
