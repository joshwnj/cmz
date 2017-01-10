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

  const relFilename = relativeToRoot(absFilename)
  const baseToken = tokenFromRelFilename(relFilename)

  const func = cmz.createClassname.bind(null, baseToken, comps)
  func.getComps = function () { return comps }

  // shortcuts
  Object.keys(comps).forEach(function (key) {
    func[key] = func(key)
  })

  return func
}

function inline (rootName, css, comps) {
  comps = comps || {}

  const absFilename = caller()
  const relFilename = relativeToRoot(absFilename)
  const baseToken = tokenFromRelFilename(relFilename) + '_' + rootName

  return cmz.createClassname.bind(null, baseToken, comps)
}

function createClassname (baseToken, comps, name) {
  let compsForName = comps[name] || []
  if (typeof compsForName === 'string') {
    compsForName = [compsForName]
  }

  const token = baseToken + (name ? `__${name}` : '')
  return [token].concat(compsForName).join(' ')
}

function tokenFromRelFilename (relFilename) {
  return relFilename.replace(/[\/\\]/g, '_').replace(/\.(.*?)$/, '')
}

function relativeToRoot (filename) {
  return filename.substr(rootDir.length + 1)
}

module.exports = cmz
module.exports.inline = inline
module.exports.createClassname = createClassname
module.exports.tokenFromRelFilename = tokenFromRelFilename
