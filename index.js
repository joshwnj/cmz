'use strict'

const path = require('path')
const caller = require('caller')

let rootDir = process.cwd()

function cmz (filename, comps) {
  comps = comps || {}

  const callerFile = caller()
  if (typeof filename !== 'string' || filename === '.') {
    filename = callerFile
  }

  const callerDir = path.dirname(callerFile)
  const absFilename = path.resolve(callerDir, filename)

  const relFilename = absFilename.substr(rootDir.length + 1)
  const baseToken = tokenFromRelFilename(relFilename)

  return cmz.createClassname.bind(null, baseToken, comps)
}

function inline (css, comps) {
  comps = comps || {}

  const absFilename = caller()
  const relFilename = absFilename.substr(rootDir.length + 1)
  const baseToken = tokenFromRelFilename(relFilename)

  return cmz.createClassname.bind(null, baseToken, comps)
}

function createClassname (baseToken, comps, name) {
  let compsForName = comps[name] || []
  if (typeof compsForName === 'string') {
    compsForName = [compsForName]
  }

  return [`${baseToken}__${name}`].concat(compsForName).join(' ')
}

function tokenFromRelFilename (relFilename) {
  return relFilename.replace(/[\/\\]/g, '_').replace(/\.(.*?)$/, '')
}

module.exports = cmz
module.exports.inline = inline
module.exports.createClassname = createClassname
module.exports.tokenFromRelFilename = tokenFromRelFilename
